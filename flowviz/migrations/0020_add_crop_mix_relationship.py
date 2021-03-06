# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2016-04-07 16:03
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('econ', '0010_auto_20160406_1456'),
        ('flowviz', '0019_auto_20160406_1456'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProjectCropMixRelationship',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('crop_mix', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='econ.CropMix')),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='flowviz.Project')),
            ],
        ),
        migrations.AddField(
            model_name='project',
            name='crop_mixes',
            field=models.ManyToManyField(through='flowviz.ProjectCropMixRelationship', to='econ.CropMix'),
        ),
    ]
