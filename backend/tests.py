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
        # test ivalid url
        response = tester.post(
            '/memes', json=dict(name='Office memer', url='', caption='caption'))
        assert response.status_code == 422
        assert json.loads(response.data)['msg'] == 'Invalid Url'
        # test non image ur;
        response = tester.post(
            '/memes', json=dict(name='Office memer', url='https://www.google.com', caption='caption'))
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
                '/memes', json=dict(name=name, url=url, caption=caption))
            assert response.status_code == 200
            assert 'id' in json.loads(response.data)
            # test re-upload : should give 409
            response = tester.post(
                '/memes', json=dict(name=name, url=url, caption=caption))
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
        _id = '601e755510395501acb7639f'
        response = tester.get(f'/memes/{_id}')
        assert response.status_code == 200

    # test PATCH /memes/<_id>
    def test_patch_memes_by_id(self):
        tester = app.test_client(self)

        # update id
        _id = '601e755510395501acb7639f'

        # SET 1
        ogcaption = "Stanley is boss"  # existing caption
        ogurl = "https://img.cinemablend.com/filter:scale/quill/0/4/e/e/e/a/04eeea84886e6db3c9d55e3698479ef00eb14f49.jpg?mw=600"  # existing url
        newcaption1 = "Stanley is still boss"  # new caption 1
        newcaption2 = "This is weird"  # new caption 2
        newurl = "https://static.mommypoppins.com/styles/image620x420/s3/school_meme_3_0.jpg"  # new url

        # SET 2
        # ogcaption = "Meme 103"  # existing caption
        # ogurl = "https://static.mommypoppins.com/styles/image620x420/s3/school_meme_3_0.jpg"  # existing url
        # newcaption1 = "Is stanley boss?"  # new caption 1
        # newcaption2 = "Stanley is boss"  # new caption 2
        # newurl = "https://img.cinemablend.com/filter:scale/quill/0/4/e/e/e/a/04eeea84886e6db3c9d55e3698479ef00eb14f49.jpg?mw=600"  # new url

        # passing existing values : gives 409 duplication
        response = tester.patch(
            f'/memes/{_id}', json={"caption": ogcaption, "url": ogurl}, headers={'Content-Type': 'application/json'})
        assert response.status_code == 409

        # updates caption and url
        response = tester.patch(
            f'/memes/{_id}', json={"caption": newcaption1, "url": ogurl}, headers={'Content-Type': 'application/json'})
        assert response.status_code == 200

        # updates caption only
        response = tester.patch(
            f'/memes/{_id}', json={"caption": newcaption2}, headers={'Content-Type': 'application/json'})
        assert response.status_code == 200

        # updates only url
        response = tester.patch(
            f'/memes/{_id}', json={"url": newurl}, headers={'Content-Type': 'application/json'})
        assert response.status_code == 200


if __name__ == "__main__":
    unittest.main()
