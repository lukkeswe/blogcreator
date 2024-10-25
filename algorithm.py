import random
from datetime import datetime


# Define the character sets
line1 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
line2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
line3 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

def user_id():
    # Get the current date
    today = datetime.today()
    year = today.year
    month = today.month
    day = today.day
    hour = today.hour
    minute = today.minute

    # Map the year to a character starting from 2024
    year_char = chr(ord('a') + (year - 2024))

    # Map the month to a character (uses the first 12 characters of line2)
    month_char = line2[month - 1]

    # Map the day of the month to a character (uses the first 31 characters of line1)
    day_char = line1[day - 1]
    # Generate three random characters from line2
    random_chars = ''.join(random.choices(line2, k=3))
    # Combine all parts to form the user ID
    id = year_char + month_char + day_char + random_chars
    
    return id

def blog_id():
    # Get the current date
    today = datetime.today()
    year = today.year
    month = today.month
    day = today.day
    hour = today.hour
    minute = today.minute

    # Map the year to a character starting from 2024
    year_char = chr(ord('a') + (year - 2024))

    # Map the month to a character (uses the first 12 characters of line2)
    month_char = line2[month - 1]

    # Map the day of the month to a character (uses the first 31 characters of line1)
    day_char = line1[day - 1]

    hour_char = line1[hour - 1]

    minute_char = line3[minute - 1]
    id = year_char + month_char + day_char + hour_char + minute_char
    return id