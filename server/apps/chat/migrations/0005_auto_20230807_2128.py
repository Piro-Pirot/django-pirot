# Generated by Django 3.1.12 on 2023-08-07 12:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0004_auto_20230807_1838'),
    ]

    operations = [
        migrations.AlterField(
            model_name='room',
            name='room_type',
            field=models.IntegerField(default=0),
        ),
    ]
