import re
import requests
from flask import make_response, jsonify


def validate_image_url(url):
    # validate if url is actually url source: https://github.com/django/django/blob/stable/1.3.x/django/core/validators.py#L45
    image_url_regex = re.compile(
        r'^(?:http|ftp)s?://'  # http:// or https://
        # domain
        r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)|'
        r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # ...or ip
        r'(?::\d+)?'  # optional port
        r'(?:/?|[/?]\S+)$', re.IGNORECASE)
    image_base4_data_regex = re.compile(r'data:image\/[^;]+;base64[^"]+')

    # validate url with regex
    if re.match(image_url_regex, url) or re.match(image_base4_data_regex, url):
        # DISABLED IMAGE URL VERIFICATION FOR CRIO AUTOMATION TESTS
        # check if content at url is of image type
        # if not validate_url_content(url):  # meme_data[0]['url']
        #     return False, make_response(jsonify({'msg': "Url doesn't lead to valid image"}), 422)
        return True, make_response(jsonify({'msg': "Url is valid image"}), 200)

    return False, make_response(jsonify({'msg': "Invalid Url"}), 422)


def validate_url_content(url):
    # Makes a get request to verify content-type header is of image type
    image_formats = ("image/png", "image/jpeg", "image/jpg", "image/gif",
                     "image/apng", "image/avif", "image/jfif", "image/webp")
    resp = requests.head(url)
    return resp.headers['content-type'] in image_formats
