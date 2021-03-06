from django.conf.urls import url

from . import views

urlpatterns = [
    #
    # Scenario views
    #

    url(r'scenario/(?P<scenario_id>[0-9]+)/$', views.ScenarioView.as_view(), name='scenario'),

    # Scenario
    url(r'scenario/(?P<scenario_id>[0-9]+)/raster/', views.dynamic_raster, name='scenario-dynamic-raster'),
    # Temporal Deficit Plots
    url(r'scenario/(?P<scenario_id>[0-9]+)/temporal_monthly/', views.deficit_days_plot, name='scenario-deficit-days'),
    url(r'scenario/(?P<scenario_id>[0-9]+)/temporal_annual/', views.annual_deficit_days_plot, name='scenario-deficit-days-annual'),
    # Volume Deficit Plots
    url(r'scenario/(?P<scenario_id>[0-9]+)/volume_monthly_pct/', views.deficit_stats_pct_plot, name='scenario-deficit-stats-pct'),
    url(r'scenario/(?P<scenario_id>[0-9]+)/volume_annual_pct/', views.deficit_stats_pct_plot_annual, name='scenario-deficit-stats-pct-annual'),
    url(r'scenario/(?P<scenario_id>[0-9]+)/volume_monthly/', views.deficit_stats_plot, name='scenario-deficit-stats'),
    url(r'scenario/(?P<scenario_id>[0-9]+)/volume_annual/', views.deficit_stats_plot_annual, name='scenario-deficit-stats-annual'),

    # Security plots
    url(r'scenario/(?P<scenario_id>[0-9]+)/eflow_security_rate_plot/', views.EFlowSecurityRatePlot.as_view(), name='scenario-eflow-security-rate-plot'),
    url(r'scenario/(?P<scenario_id>[0-9]+)/eflow_permanence_rate_plot/', views.EFlowPermanenceRatePlot.as_view(), name='scenario-eflow-permanence-rate-plot'),
    url(r'scenario/(?P<scenario_id>[0-9]+)/eflow_security_annual_volume_plot/', views.EFlowSecurityAnnualVolumePlot.as_view(), name='scenario-eflow-security-annual-volume-plot'),
    url(r'scenario/(?P<scenario_id>[0-9]+)/eflow_permanence_annual_volume_plot/', views.EFlowPermanenceAnnualVolumePlot.as_view(), name='scenario-eflow-permanence-annual-volume-plot'),
    url(r'scenario/(?P<scenario_id>[0-9]+)/eflow_security_deficit_volume_plot/', views.EFlowSecurityDeficitVolumePlot.as_view(), name='scenario-eflow-security-deficit-volume-plot'),
    url(r'scenario/(?P<scenario_id>[0-9]+)/eflow_permanence_deficit_volume_plot/', views.EFlowPermanenceDeficitVolumePlot.as_view(), name='scenario-eflow-permanence-deficit-volume-plot'),

    # Drought plots
    url(r'scenario/(?P<scenario_id>[0-9]+)/temporal_drought/', views.temporal_deficit_drought_plot, name='scenario-temporal-deficit-drought-plot'),
    url(r'scenario/(?P<scenario_id>[0-9]+)/volume_drought/', views.volume_deficit_drought_plot, name='scenario-volume-deficit-drought-plot'),

    # Agriculture plots
    url(r'scenario/(?P<scenario_id>[0-9]+)/crop_area/', views.CropAreaView.as_view(), name='scenario-crop-area'),
    url(r'scenario/(?P<scenario_id>[0-9]+)/crop_fraction/', views.CropFractionView.as_view(), name='scenario-crop-fraction'),
    url(r'scenario/(?P<scenario_id>[0-9]+)/crop_revenue/', views.CropRevenueView.as_view(), name='scenario-crop-revenue'),
    url(r'scenario/(?P<scenario_id>[0-9]+)/crop_niwr/', views.CropNIWRView.as_view(), name='scenario-crop-niwr'),
    url(r'scenario/(?P<scenario_id>[0-9]+)/crop_revenue_per_af/', views.CropRevenuePerAFView.as_view(), name='scenario-crop-revenue-per-af'),
    url(r'scenario/(?P<scenario_id>[0-9]+)/crop_labor/', views.CropLaborView.as_view(), name='scenario-crop-labor'),

    # Other Scenario URLs
    url(r'scenario/(?P<scenario_id>[0-9]+)/average/', views.right_plot, name='scenario-average'),
    url(r'scenario/(?P<scenario_id>[0-9]+)/data/', views.scenario_data, name='scenario-data'),
    url(r'scenario/(?P<scenario_id>[0-9]+)/annual_min/', views.long_term_minimum_plot, name='scenario-annual-min'),

    # Edit/create URLs
    url(r'scenario/(?P<object_id>[0-9]+)/edit/', views.EditScenario.as_view(), name='scenario-edit'),

    # Data access URLs.
    url(r'scenario/(?P<scenario_id>[0-9]+)/data', views.DownloadScenarioData.as_view(), name='download-scenario-data'),
    url(r'scenario/(?P<scenario_id>[0-9]+)/summary-hydrograph', views.DownloadScenarioSummaryHydrograph.as_view(), name='download-scenario-summary-hydrograph'),
    url(r'scenario/(?P<scenario_id>[0-9]+)/monthly-temporal-deficit', views.DownloadScenarioMonthlyTemporalDeficit.as_view(), name='download-scenario-monthly-temporal-deficit'),
    url(r'scenario/(?P<scenario_id>[0-9]+)/annual-temporal-deficit', views.DownloadScenarioAnnualTemporalDeficit.as_view(), name='download-scenario-annual-temporal-deficit'),
    url(r'scenario/(?P<scenario_id>[0-9]+)/monthly-volume-deficit-pct', views.DownloadScenarioMonthlyVolumeDeficit.as_view(), name='download-scenario-monthly-volume-deficit-pct'),
    url(r'scenario/(?P<scenario_id>[0-9]+)/annual-volume-deficit-pct', views.DownloadScenarioAnnualVolumeDeficit.as_view(), name='download-scenario-annual-volume-deficit-pct'),
    url(r'scenario/(?P<scenario_id>[0-9]+)/monthly-volume-deficit-af', views.DownloadScenarioMonthlyVolumeDeficitAF.as_view(), name='download-scenario-monthly-volume-deficit-af'),
    url(r'scenario/(?P<scenario_id>[0-9]+)/annual-volume-deficit-af', views.DownloadScenarioAnnualVolumeDeficitAF.as_view(), name='download-scenario-annual-volume-deficit-af'),
    url(r'scenario/(?P<scenario_id>[0-9]+)/hydrologic-trend', views.DownloadScenarioHydrologicTrend.as_view(), name='download-scenario-hydrologic-trend'),

]
