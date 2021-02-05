import json
import unittest
from app import app


class APITests(unittest.TestCase):
    # test GET /memes
    def test_get_memes(self):
        tester = app.test_client(self)
        response = tester.get('/memes')
        data = json.loads(response.data)
        assert response.status_code == 200
        assert len(data) <= 100

    # test POST /memes
    def test_post_memes(self):
        tester = app.test_client(self)
        # test ivalid ur;
        response = tester.post(
            '/memes', query_string=dict(name='Office memer', url='', caption='caption'))
        assert response.status_code == 422
        assert json.loads(response.data)['msg'] == 'Invalid Url'
        # test non image ur;
        response = tester.post(
            '/memes', query_string=dict(name='Office memer', url='https://www.google.com', caption='caption'))
        assert response.status_code == 422
        assert json.loads(response.data)[
            'msg'] == "Url doesn't lead to valid image"
        # test Valid upload

        # IMPORTANT: REPLACE url param with new image or change owner name
        name = ''
        url = ""
        caption = ''
        if name and url and caption:
            response = tester.post(
                '/memes', query_string=dict(name=name, url=url, caption=caption))
            assert response.status_code == 200
            assert 'id' in json.loads(response.data)
            # test re-upload : should give 409
            response = tester.post(
                '/memes', query_string=dict(name=name, url=url, caption=caption))
            assert response.status_code == 409
            assert json.loads(response.data)[
                'msg'] == "Entry already exists"

    # test GET /memes/<_id>
    def test_get_meme_by_id(self):
        tester = app.test_client(self)
        # test with invalid id
        _id = 'abcd'
        response = tester.get(f'/memes/{_id}')
        assert response.status_code == 404
        # test with existing id
        _id = '601d1514954ea510ec5396d6'
        response = tester.get(f'/memes/{_id}')
        assert response.status_code == 200

    # test PATCH /memes/<_id>
    def test_patch_memes_by_id(self):
        tester = app.test_client(self)

        # update id
        _id = '601d1514954ea510ec5396d6'

        caption = "Office"  # existing caption
        url = "https://i.pinimg.com/736x/90/bf/93/90bf93263e6378c4b8841873f98de89f.jpg"
        response = tester.patch(
            f'/memes/{_id}', data="{\"caption\" : \""+caption+"\",\"url\": \""+url+"\"}", headers={'Content-Type': 'text/plain'})
        assert response.status_code == 409

        caption = "New Caption"  # new caption
        response = tester.patch(
            f'/memes/{_id}', data="{\"caption\" : \""+caption+"\",\"url\": \""+url+"\"}", headers={'Content-Type': 'text/plain'})
        assert response.status_code == 200


if __name__ == "__main__":
    unittest.main()
