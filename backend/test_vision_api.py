import os
import json
from yandex.cloud.ai.vision.v1 import vision_service_pb2_grpc, vision_service_pb2
from yandex.cloud.ai.vision.v1.vision_service_pb2 import (
    BatchAnalyzeRequest,
    Feature,
    FeatureConfig,
    FeatureType,
    TextDetectionConfig,
    TextDetectionModel
)
from yandex.cloud.iam.v1.iam_token_service_pb2_grpc import IamTokenServiceStub
from yandex.cloud.iam.v1.iam_token_service_pb2 import CreateIamTokenRequest
import grpc

def get_iam_token(api_key):
    channel = grpc.secure_channel('iam.api.cloud.yandex.net:443', 
                                grpc.ssl_channel_credentials())
    stub = IamTokenServiceStub(channel)
    response = stub.Create(CreateIamTokenRequest(api_key=api_key))
    return response.iam_token

def test_vision_api():
    # Get credentials from environment
    api_key = os.getenv('YANDEX_IMAGES_API_KEY')
    folder_id = os.getenv('YANDEX_FOLDER_ID')
    
    if not all([api_key, folder_id]):
        print("❌ Error: Missing required environment variables")
        print("Please set YANDEX_IMAGES_API_KEY and YANDEX_FOLDER_ID")
        return
    
    try:
        # Get IAM token
        iam_token = get_iam_token(api_key)
        
        # Set up gRPC channel
        channel = grpc.secure_channel('vision.api.cloud.yandex.net:443', 
                                    grpc.ssl_channel_credentials())
        
        # Create stub
        stub = vision_service_pb2_grpc.VisionServiceStub(channel)
        
        # Prepare request
        request = BatchAnalyzeRequest(
            folder_id=folder_id,
            analyze_specs=[
                vision_service_pb2.AnalyzeSpec(
                    content=b'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
                    features=[
                        Feature(
                            type=FeatureType.TEXT_DETECTION,
                            config=FeatureConfig(
                                text_detection_config=TextDetectionConfig(
                                    language_codes=['*'],
                                    model=TextDetectionModel.PAGE
                                )
                            )
                        )
                    ]
                )
            ]
        )
        
        # Add authorization metadata
        metadata = [('authorization', f'Bearer {iam_token}')]
        
        # Make the request
        response = stub.BatchAnalyze(request, metadata=metadata)
        
        print("✅ Successfully connected to Yandex Vision API!")
        print("Response:", response)
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        if hasattr(e, 'details'):
            print(f"Details: {e.details()}")
        if hasattr(e, 'code'):
            print(f"Error code: {e.code()}")

if __name__ == "__main__":
    test_vision_api()
