from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),

    url(r'projects/$', views.projects, name='projects'),
    url(r'projects/(?P<project_id>[0-9]+)/$', views.ProjectDetailView.as_view(), name='project_detail'),
    url(r'projects/(?P<project_id>[0-9]+)/compare/$', views.project_compare, name='project_compare'),

    url(r'projects/(?P<object_id>[0-9]+)/edit',
        views.ProjectEditView.as_view(),
        name="project-edit"
    ),

    url(r'projects/new', views.NewProjectView.as_view(), name="project-new"),

    url(r'projects/(?P<project_id>[0-9]+)/newscenario',
        views.ProjectNewScenarioView.as_view(),
        name="project-new-scenario"
    ),

    # Project comparison static plot urls.
    url(r'projects/(?P<project_id>[0-9]+)/compare/pct_plot$', views.project_deficit_days_plot, name='project_pct_plot'),

    url(r'projects/(?P<project_id>[0-9]+)/compare/stats_plot$', views.project_deficit_stats_plot, name='project_stats_plot'),
    url(r'projects/(?P<project_id>[0-9]+)/compare/stats_pct_plot$', views.project_deficit_stats_pct_plot, name='project_stats_pct_plot'),

    # Project comparison data URLs
    url(r'projects/(?P<project_id>[0-9]+)/data/$', views.project_data, name='project_data'),
    url(r'projects/(?P<project_id>[0-9]+)/pct_csv/$', views.project_deficit_days_csv, name='project_deficit_days_csv'),
    url(r'projects/(?P<project_id>[0-9]+)/pct_annual_csv/$', views.project_deficit_days_annual_csv, name='project_deficit_days_annual_csv'),

    url(r'projects/(?P<project_id>[0-9]+)/stats_csv/$', views.project_deficit_stats_csv, name='project_deficit_stats_csv'),
    url(r'projects/(?P<project_id>[0-9]+)/stats_annual_csv/$', views.project_deficit_stats_annual_csv, name='project_deficit_stats_annual_csv'),

    url(r'projects/(?P<project_id>[0-9]+)/stats_pct_csv/$', views.project_deficit_stats_pct_csv, name='project_deficit_stats_pct_csv'),
    url(r'projects/(?P<project_id>[0-9]+)/stats_annual_pct_csv/$', views.project_deficit_stats_annual_pct_csv, name='project_deficit_stats_annual_pct_csv'),
    url(r'projects/(?P<project_id>[0-9]+)/lowflow_pct_csv/$', views.project_low_flow_csv, name='project_low_flow_csv'),
    url(r'projects/(?P<project_id>[0-9]+)/lowflow_pct_plot/$', views.project_low_flow_plot, name='project_low_flow_plot'),

    url(
        r'projectscenariorelationship/$',
        views.ListProjectScenarioRelationship.as_view(),
        name='list-project-scenario-relationship'
    ),

    url(
        r'projectscenariorelationship/(?P<pk>[0-9]+)/$',
        views.ProjectScenarioRelationshipDetail.as_view(),
        name='project-scenario-relationship-detail'
    ),
    
    url(
        r'projectcropmixrelationship/$',
        views.ListProjectCropMixRelationship.as_view(),
        name='list-project-cropmix-relationship'
    ),

    url(
        r'projectcropmixrelationship/(?P<pk>[0-9]+)/$',
        views.ProjectCropMixRelationshipDetail.as_view(),
        name='project-cropmix-relationship-detail'
    )
]
