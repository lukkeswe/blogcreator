from flask import Flask, request, jsonify, session, redirect, render_template, url_for
import mysql.connector
import os
from werkzeug.utils import secure_filename
import algorithm
import json

app = Flask(__name__)
app.secret_key = '07023142840'

# MySQL/MariaDB Config
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'tvtittaren',
    'database': 'BLOG'
}

# Folder to store uploaded images
UPLOAD_FOLDER = 'static/img/'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Allowed extensions (e.g., only images)
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# Helper function to check if the file is an allowed type
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Route to render the webpage
@app.route('/')
def index():
    if session.get('user_id') is not None:
        session.pop('user_id', None)
    return render_template('index.html')

@app.route('/blog_creator')
def blog_creator():
    if session.get('blog_id') is None:
        return redirect(url_for('home'))
    else:
        json_save = json.dumps(session['blog_structure'])
        return render_template('blogcreator.html', blog=session['blog_id'], save=json_save)

@app.route('/set_blogid', methods=['POST'])
def set_blogid():
    session['blog_id'] = request.form['blogid']
    return redirect(url_for('retrive_blog'))
        
@app.route('/home')
def home():
    if session.get('user_id') is None:
        return redirect(url_for('index'))
    else:
        print(session['user_id'])
        blogs = retive_all_blogs(session['user_id'])
    if session.get('blog_id')  is not None:
        session.pop('blog_id', None)
    if blogs:
        return render_template('home.html', user=session['user_id'], blogs=blogs)
    else:
        return render_template('home.html', user=session['user_id'])
    
def retive_all_blogs(user):
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        
        sql ="SELECT * FROM bl_blogs WHERE user_id = %s"
        cursor.execute(sql, (user,))
        result = cursor.fetchall()
        return result
    except mysql.connector.Error as err:
        return jsonify({'status': 'error', 'message': f"Database error: {err}"})
    finally:
        cursor.close()
        conn.close()

# Upload route to handle the image upload
@app.route('/upload', methods=['POST'])
def upload_image():
    # Check if the post request has the file part
    if 'image' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['image']

    # If the user does not select a file, the browser submits an empty part
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # If file is valid, save it to the uploads folder
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        return jsonify({'success': True, 'message': 'Image uploaded successfully!', 'file_path': file_path}), 200
    else:
        return jsonify({'error': 'Invalid file type'}), 400

# Ensure uploads directory exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Route to handle AJAX request and insert data into the database
@app.route('/insert', methods=['POST'])
def insert():
    user_id = session.get('user_id')  # Get the user_id from session
    blog = session.get('blog_id')
    data = request.json  # Get the entire array of data from the request
    structure = ""
    
    if user_id:
        try:
            # Connect to the database
            conn = mysql.connector.connect(**db_config)
            cursor = conn.cursor()

            cursor.execute("SELECT bl_id FROM bl_blogs WHERE bl_id = %s", (blog,))
            result_tuple = cursor.fetchall()
            exist = False
            for item in result_tuple:
                if item[0] == blog:
                    exist = True
            if exist:
                print("Updating:", blog)
                for article in data:
                    query_article = """
                        UPDATE bl_articles
                        SET title = %s, text = %s, src = %s
                        WHERE bl_id = %s AND id = %s
                    """
                    cursor.execute(query_article, (article['title'], article['text'], article.get('src'), blog, article['id']))
                    
                    query_style = """
                        UPDATE bl_styles 
                        SET titleColour = %s, textColour = %s, backgroundColor = %s, titleWeight = %s, textWeight = %s
                        WHERE bl_id = %s AND article_id = %s
                    """
                    cursor.execute(query_style, (article['style']['titleColour'], article['style']['textColour'],
                                                 article['style']['backgroundColor'], article['style']['titleWeight'], 
                                                 article['style']['textWeight'], blog, article['id']))
                    
                    if 'article' in article:
                        for child_article in article['article']:
                            query_child_article = """
                                UPDATE bl_child_articles
                                SET title = %s, text = %s, src = %s
                                WHERE bl_id = %s AND parent_article_id = %s AND id = %s
                            """
                            cursor.execute(query_child_article, (child_article['title'], child_article['text'], child_article.get('src'), 
                                                                 blog,  article['id'], child_article['id']))
                            
                            query_child_style = """
                                UPDATE bl_child_styles
                                SET titleColour = %s, textColour = %s, backgroundColor = %s, titleWeight = %s, textWeight = %s
                                WHERE bl_id = %s AND parent_article_id = %s AND child_id = %s
                            """
                            cursor.execute(query_child_style, (child_article['style']['titleColour'], child_article['style']['textColour'],
                                                               child_article['style']['backgroundColor'], child_article['style']['titleWeight'], 
                                                               child_article['style']['textWeight'], blog, article['id'], child_article['id']))
                    
            else:
                print("Inserting:", blog)
                structure = ""
                for article in data:
                    # Insert main article
                    query_article = """
                        INSERT INTO bl_articles (user_id, bl_id, id, title, text, src) 
                        VALUES (%s, %s, %s, %s, %s, %s)
                    """
                    cursor.execute(query_article, ( user_id, blog, article['id'], article['title'], article['text'], article.get('src')))
                    if structure == "":
                        structure = article['id']
                    else:
                        structure = structure + "," + article['id']

                    # Insert style associated with the article
                    query_style = """
                        INSERT INTO bl_styles (bl_id, article_id, titleColour, textColour, backgroundColor, titleWeight, textWeight)
                        VALUES (%s, %s, %s, %s, %s, %s, %s)
                    """
                    cursor.execute(query_style, (blog,
                        article['id'], article['style']['titleColour'], article['style']['textColour'],
                        article['style']['backgroundColor'], article['style']['titleWeight'], article['style']['textWeight']
                    ))

                    # Insert nested articles (if present)
                    if 'article' in article:
                        for child_article in article['article']:
                            query_child_article = """
                                INSERT INTO bl_child_articles (bl_id, id, parent_article_id, title, text, src)
                                VALUES (%s, %s, %s, %s, %s, %s)
                            """
                            cursor.execute(query_child_article, (blog, child_article['id'], article['id'], child_article['title'], child_article['text'], child_article.get('src')))
                            
                            query_child_style = """
                                INSERT INTO bl_child_styles (bl_id, parent_article_id, child_id, titleColour, textColour, backgroundColor, titleWeight, textWeight) 
                                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                            """
                            cursor.execute(query_child_style, (blog, article['id'], child_article['id'], child_article['style']['titleColour'], child_article['style']['textColour'], 
                                                            child_article['style']['backgroundColor'], child_article['style']['titleWeight'], child_article['style']['textWeight']))

                print("structure:", structure)
                cursor.execute("INSERT INTO bl_structure (bl_id, bl_structure) VALUES (%s, %s)", (blog, structure))
            
            conn.commit()
            print("Saved style")
            cursor.close()
            conn.close()

            return jsonify({'status': 'success', 'message': 'Data inserted successfully!'})
        except mysql.connector.Error as err:
            return jsonify({'status': 'error', 'message': f"Database error: {err}"})
    else:
        return jsonify({'status': 'error', 'message': 'No session value found'})

@app.route('/test')
def test():
    return render_template('test.html')

#Creating a new function to add a new user to the database
@app.route('/create_user', methods=['POST'])
def create_user():
    new_username = request.form['username']
    new_password = request.form['password']
    
    try:
        # Connect to the database
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        
        insert_query = """
            INSERT INTO bl_user (
                id,
                name,
                password
            ) VALUES (
                %s, %s, %s
                )
        """
        cursor.execute("SELECT id, name FROM bl_user WHERE name = %s", (new_username,))
        result = cursor.fetchall()
        if result:
            print("Username alreafy exist")
        else:
            while True:
                user_id = algorithm.user_id()
                cursor.execute("SELECT id, name FROM bl_user WHERE id = %s", (user_id,))
                result = cursor.fetchall()
                if result:
                    print(f"user id '{user_id}' already exists. Trying again...")
                else:
                    print(f"User id '{user_id}' aproved")
                    break
            cursor.execute(insert_query, (user_id, new_username, new_password))
            conn.commit()
        
    except mysql.connector.Error as err:
        return jsonify({'status': 'error', 'message': f"Database error: {err}"})
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
    
    return jsonify({'status': 'success', 'message': 'New user created successfully!'})

@app.route('/login', methods=['POST'])
def login():
    username = request.form['username']
    password = request.form['password']
    
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        
        cursor.execute("SELECT * FROM bl_user WHERE name = %s", (username ,))
        result = cursor.fetchall()
        if result:
            if result[0][2] == password:
                print("Logged in successfully")
                user = result[0][0]
                print("user id:", user)
                session['user_id'] = user
                return redirect(url_for('home'))
            else:
                print("Wrong password")
                return redirect(url_for('test'))
        else:
            print(f"No username like: '{username}' found")
            return redirect(url_for('index'))
        
    except mysql.connector.Error as err:
        return jsonify({'status': 'error', 'message': f"Database error: {err}"})
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@app.route('/create_blog', methods=['POST'])
def create_blog():
    blog_name = request.form['name']
    user_id = request.form['user']
    
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        
        while True:
            blog_id = user_id + algorithm.blog_id()
            cursor.execute("SELECT bl_id FROM bl_blogs WHERE bl_id = %s", (blog_id ,))
            result = cursor.fetchall()
            print("blog id: ", blog_id)
            print("result: ", result)
            
            insert_query = """
                    INSERT INTO bl_blogs (
                        user_id,
                        bl_id,
                        bl_name
                    ) VALUES (
                        %s, %s, %s
                    )
                """
            
            if result:
                exist = False
                for bl_id in result:
                    if bl_id[0] == blog_id:
                        exist = True
                    if exist == True:
                        print("blog already exists")
                        return redirect(url_for('home'))
                if exist == False:
                    cursor.execute(insert_query, (user_id, blog_id, blog_name))
                    conn.commit()
                    session['blog_id'] = blog_id
                    return redirect(url_for('blog_creator'))
            else:
                cursor.execute(insert_query, (user_id, blog_id, blog_name))
                conn.commit()
                session['blog_id'] = blog_id
                return redirect(url_for('blog_creator'))
    except mysql.connector.Error as err:
        return jsonify({'status': 'error', 'message': f"Database error: {err}"})
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
            
#(function that inserts all of the information first)
@app.route('/retrive_blog')
def retrive_blog():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        
        cursor.execute("SELECT bl_name FROM bl_blogs WHERE bl_id = %s", (session['blog_id'],))
        blog_name_tuple = cursor.fetchone()
        session['blog_name'] = blog_name_tuple[0]
        print("blog_id:", session['blog_id'])
        print("Fetched:", session['blog_name'])
        
        cursor.execute("SELECT bl_structure FROM bl_structure WHERE bl_id = %s", (session['blog_id'],))
        structure_tuple = cursor.fetchone()
        print("structure_tuple:", structure_tuple)
        if structure_tuple:
            structure = structure_tuple[0]
            structure = structure.split(",")
            print("structure:", structure)
            cursor.execute("SELECT * FROM bl_articles WHERE bl_id = %s", (session['blog_id'],))
            content = cursor.fetchall()
            cursor.execute("SELECT * FROM bl_styles WHERE bl_id = %s", (session['blog_id'],))
            style = cursor.fetchall()
            
            save = []
            
            for item in structure:
                print("Item:", item)
                article = {}
                article['id'] = item
                for row in content:
                    if item == row[2]:
                        article['title'] = row[3]
                        article['text'] = row[4]
                        if item[0:3] == "art":
                            article['src'] = row[5]
                
                save_style = {}
                for pice in style:
                    if item == pice[1]:
                        save_style['titleColour'] = pice[2]
                        save_style['textColour'] = pice[3]
                        save_style['backgroundColor'] = pice[4]
                        save_style['titleWeight'] = pice[5]
                        save_style['textWeight'] = pice[6]
                article['style'] = save_style
                
                if item[0:3] == "fxl":
                    articles = []
                    cursor.execute("SELECT * FROM bl_child_articles WHERE bl_id = %s", (session['blog_id'],))
                    children = cursor.fetchall()
                    for child in children:
                        if item == child[1]:
                            cursor.execute("SELECT * FROM bl_child_styles WHERE bl_id = %s AND parent_article_id = %s", (session['blog_id'], item))
                            child_styles = cursor.fetchall()
                            child_article = {}
                            child_article['id'] = child[5]
                            child_article['title'] = child[2]
                            child_article['text'] = child[3]
                            child_article['src'] = child[4]
                            for child_style in child_styles:
                                if child_article['id'] == child_style[2]:
                                    child_article['style'] = {}
                                    child_article['style']['titleColour'] = child_style[3]
                                    child_article['style']['textColour'] = child_style[4]
                                    child_article['style']['backgroundColor'] = child_style[5]
                                    child_article['style']['titleWeight'] = child_style[6]
                                    child_article['style']['textWeight'] = child_style[7]
                            articles.append(child_article)
                    article['article'] = articles
                save.append(article)
            print(save)
            session['blog_structure'] = save
            print("session save:")
            for row in save:
                print(row)
            return redirect(url_for('blog_creator'))
        
    except mysql.connector.Error as err:
        return jsonify({'status': 'error', 'message': f"Database error: {err}"})
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=1337)
