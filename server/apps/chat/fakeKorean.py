from faker import Faker
import random

def fake_korean_first():
    fake = Faker('ko-KR')

    fake_list = fake.catch_phrase().split()

    return fake_list[random.randint(0, len(fake_list) - 1)]

def fake_korean_second():
    fake = Faker('ko-KR')

    fake_list = []
    fake_list.append(fake.country())
    fake_list.append(fake.road_name())
    fake_list.append(fake.street_name())

    return fake_list[random.randint(0, len(fake_list) - 1)]