import json
import os
import boto3
import httpx
import base64
import uuid

def handler(event: dict, context) -> dict:
    """Генерация изображения по текстовому описанию через FLUX и сохранение в S3."""
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }

    body = json.loads(event.get('body') or '{}')
    prompt = body.get('prompt', '').strip()

    if not prompt:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'prompt is required'})
        }

    fal_key = os.environ.get('FAL_API_KEY', '')

    resp = httpx.post(
        'https://fal.run/fal-ai/flux/schnell',
        headers={
            'Authorization': f'Key {fal_key}',
            'Content-Type': 'application/json',
        },
        json={
            'prompt': prompt,
            'image_size': 'square_hd',
            'num_inference_steps': 4,
            'num_images': 1,
        },
        timeout=30,
    )
    resp.raise_for_status()
    data = resp.json()

    image_url = data['images'][0]['url']

    img_resp = httpx.get(image_url, timeout=30)
    img_resp.raise_for_status()
    img_bytes = img_resp.content

    key = f'media/{uuid.uuid4()}.jpg'
    s3 = boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
    )
    s3.put_object(Bucket='files', Key=key, Body=img_bytes, ContentType='image/jpeg')

    cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'url': cdn_url, 'prompt': prompt})
    }
