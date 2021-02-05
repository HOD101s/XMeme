import json
import unittest
from app import app


class APITests(unittest.TestCase):
    def test_get_memes(self):
        tester = app.test_client(self)
        response = tester.get('/memes')
        data = json.loads(response.data)
        assert response.status_code == 200
        assert len(data) <= 100

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

        name = 'Office memer'
        url = "https://i.chzbgr.com/full/9287716864/h9E975325/the-office-meme-face-opendulum-corporation-let-me-see-the-copier-again-get-out"
        caption = 'Hank be Hank-in'
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


if __name__ == "__main__":
    unittest.main()
