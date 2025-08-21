# app/services/pdf_service.py
from jinja2 import Environment, FileSystemLoader, select_autoescape
from weasyprint import HTML, CSS
from pathlib import Path

TEMPLATES = Path(__file__).resolve().parents[1] / "templates"
env = Environment(loader=FileSystemLoader(TEMPLATES),
                  autoescape=select_autoescape(enabled_extensions=("html","xml")))

def render_html(template_name: str, context: dict) -> str:
    return env.get_template(template_name).render(**context)

def html_to_pdf_bytes(html_str: str, css_files: list[str] | None=None) -> bytes:
    css_objs = [CSS(filename=css) for css in (css_files or [])]
    return HTML(string=html_str, base_url=str(TEMPLATES)).write_pdf(stylesheets=css_objs)
