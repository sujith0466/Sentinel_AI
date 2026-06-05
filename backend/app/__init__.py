from flask import Flask
from config import Config
from app.extensions import db, jwt, socketio, migrate, cors

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    socketio.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app)

    # Register blueprints
    from app.api.auth import bp as auth_bp
    from app.api.cases import bp as cases_bp
    from app.api.criminals import bp as criminals_bp
    from app.api.victims import bp as victims_bp
    from app.api.evidence import bp as evidence_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(cases_bp)
    app.register_blueprint(criminals_bp)
    app.register_blueprint(victims_bp)
    app.register_blueprint(evidence_bp)

    from app.api.intelligence import bp as intelligence_bp
    app.register_blueprint(intelligence_bp)
    
    from app.api.network import bp as network_bp
    app.register_blueprint(network_bp)
    
    from app.api.investigation import bp as inv_bp
    app.register_blueprint(inv_bp)
    
    from app.api.briefs import bp as briefs_bp
    app.register_blueprint(briefs_bp)
    
    from app.api.risk import bp as risk_bp
    app.register_blueprint(risk_bp)
    
    from app.api.hotspots import bp as hotspots_bp
    app.register_blueprint(hotspots_bp)
    
    from app.api.forecast import bp as forecast_bp
    app.register_blueprint(forecast_bp)
    
    from app.api.sociology import bp as sociology_bp
    app.register_blueprint(sociology_bp)
    
    from app.api.governance import bp as governance_bp
    app.register_blueprint(governance_bp)
    
    @app.route('/')
    def index():
        return "SentinelAI Backend API is running."

    return app
