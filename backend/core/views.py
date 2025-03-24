# ============================================================================
# File Path: backend/core/views.py
# Description: Core views for the Django application
# ============================================================================

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response


@api_view(['GET'])
@permission_classes([AllowAny])
def root(request):
    """API root endpoint providing documentation."""
    return Response({
        'name': 'Calibrify API',
        'version': '1.0.0',
        'endpoints': {
            'admin': '/admin/',
            'api': '/api/',
            'equipment': '/api/equipment/',
            'calibrations': '/api/calibrations/',
            'maintenance': '/api/maintenance/',
        },
        'documentation': 'API documentation is available at /api/docs/',
    }) 