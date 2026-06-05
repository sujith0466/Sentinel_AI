from flask import Blueprint, jsonify, request, Response
from app.models.intelligence_brief import IntelligenceBrief
from app.services.briefs import BriefGenerator, PDFService

bp = Blueprint('briefs', __name__, url_prefix='/api/briefs')

@bp.route('/', methods=['GET'])
def get_briefs():
    briefs = IntelligenceBrief.query.order_by(IntelligenceBrief.created_at.desc()).all()
    return jsonify([b.to_dict() for b in briefs]), 200

@bp.route('/<id>', methods=['GET'])
def get_brief(id):
    brief = IntelligenceBrief.query.get_or_404(id)
    return jsonify(brief.to_dict()), 200

@bp.route('/generate', methods=['POST'])
def generate_brief():
    data = request.json
    entity_type = data.get('entity_type')
    entity_id = data.get('entity_id')
    
    if not entity_type or not entity_id:
        return jsonify({"error": "entity_type and entity_id required"}), 400
        
    generator = BriefGenerator()
    result = generator.generate_brief(entity_type, entity_id)
    if "error" in result:
        return jsonify(result), 500
    return jsonify(result), 201

@bp.route('/<id>/download', methods=['GET'])
def download_brief(id):
    brief = IntelligenceBrief.query.get_or_404(id)
    pdf_bytes = PDFService.generate_pdf(brief.content_markdown)
    
    if not pdf_bytes:
         return jsonify({"error": "PDF generation failed"}), 500
         
    return Response(
        pdf_bytes,
        mimetype="application/pdf",
        headers={"Content-disposition": f"attachment; filename=Intelligence_Brief_{brief.id[:8]}.pdf"}
    )
