# Generated by Django 4.1.10 on 2023-08-07 13:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('local_users', '0005_auto_20230807_1838'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bookmark',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
        migrations.AlterField(
            model_name='user',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
    ]
