import pytest
from app.geospatial.geo_service import haversine_distance_km, GeospatialService

def test_haversine_distance():
    # Distance between Baramati (18.1512, 74.5771) and nearby point (18.1580, 74.5820)
    d = haversine_distance_km(18.1512, 74.5771, 18.1580, 74.5820)
    assert 0.8 < d < 1.2

def test_synthetic_data_isolation():
    # Synthetic records must NEVER be presented as real OSM items
    records = GeospatialService.generate_synthetic_competitors(
        latitude=18.1512,
        longitude=74.5771,
        category_slug="poultry",
        radius_km=5.0,
        count=3
    )
    assert len(records) == 3
    for r in records:
        assert r["is_synthetic"] is True
        assert "SYNTH" in r["synthetic_id"]
        assert r["distance_km"] <= 5.0
