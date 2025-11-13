from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from datetime import datetime
import os
import json

def generate_pdf_report(title: str, data: dict, notes: str = "") -> str:
    """Generate a PDF report from investigation data"""
    
    # Create reports directory if it doesn't exist
    os.makedirs("./reports", exist_ok=True)
    
    # Generate filename
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"OSINT_Report_{timestamp}.pdf"
    filepath = f"./reports/{filename}"
    
    # Create PDF document
    doc = SimpleDocTemplate(
        filepath,
        pagesize=letter,
        rightMargin=72,
        leftMargin=72,
        topMargin=72,
        bottomMargin=18
    )
    
    # Container for the 'Flowable' objects
    elements = []
    
    # Define styles
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#0066cc'),
        spaceAfter=30,
        alignment=TA_CENTER
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=16,
        textColor=colors.HexColor('#003366'),
        spaceAfter=12,
        spaceBefore=12
    )
    
    normal_style = styles['Normal']
    
    # Add title
    elements.append(Paragraph(title, title_style))
    elements.append(Spacer(1, 12))
    
    # Add metadata
    metadata_data = [
        ['Report Generated:', datetime.now().strftime("%Y-%m-%d %H:%M:%S")],
        ['Investigation Type:', data.get('type', 'General OSINT')],
        ['Status:', 'Completed']
    ]
    
    metadata_table = Table(metadata_data, colWidths=[2*inch, 4*inch])
    metadata_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#e6f2ff')),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey)
    ]))
    
    elements.append(metadata_table)
    elements.append(Spacer(1, 20))
    
    # Add findings section
    elements.append(Paragraph("Investigation Findings", heading_style))
    elements.append(Spacer(1, 12))
    
    # Process data based on type
    if 'username' in data:
        elements.append(Paragraph(f"<b>Target Username:</b> {data['username']}", normal_style))
        elements.append(Spacer(1, 6))
        
        if 'found_on' in data and data['found_on']:
            elements.append(Paragraph(f"<b>Platforms Found:</b> {len(data['found_on'])}", normal_style))
            elements.append(Spacer(1, 6))
            
            platform_list = ", ".join(data['found_on'][:10])
            elements.append(Paragraph(f"<i>{platform_list}</i>", normal_style))
            elements.append(Spacer(1, 12))
    
    if 'email' in data:
        elements.append(Paragraph(f"<b>Target Email:</b> {data['email']}", normal_style))
        elements.append(Spacer(1, 6))
        
        if 'breach_data' in data and data['breach_data'].get('breaches_found'):
            breach_count = data['breach_data'].get('breach_count', 0)
            risk_level = data['breach_data'].get('risk_level', 'UNKNOWN')
            elements.append(Paragraph(f"<b>Data Breaches Found:</b> {breach_count}", normal_style))
            elements.append(Paragraph(f"<b>Risk Level:</b> <font color='red'>{risk_level}</font>", normal_style))
            elements.append(Spacer(1, 12))
    
    if 'ip' in data:
        elements.append(Paragraph(f"<b>Target IP:</b> {data['ip']}", normal_style))
        elements.append(Spacer(1, 6))
        
        if 'geolocation' in data:
            geo = data['geolocation']
            elements.append(Paragraph(f"<b>Location:</b> {geo.get('city', 'N/A')}, {geo.get('region', 'N/A')}, {geo.get('country', 'N/A')}", normal_style))
            elements.append(Paragraph(f"<b>Organization:</b> {geo.get('org', 'N/A')}", normal_style))
            elements.append(Spacer(1, 12))
    
    if 'domain' in data:
        elements.append(Paragraph(f"<b>Target Domain:</b> {data['domain']}", normal_style))
        elements.append(Spacer(1, 6))
        
        if 'whois' in data:
            whois_data = data['whois']
            elements.append(Paragraph(f"<b>Registrar:</b> {whois_data.get('registrar', 'N/A')}", normal_style))
            elements.append(Paragraph(f"<b>Creation Date:</b> {whois_data.get('creation_date', 'N/A')}", normal_style))
            elements.append(Spacer(1, 12))
    
    # Add raw data section
    elements.append(PageBreak())
    elements.append(Paragraph("Raw Data", heading_style))
    elements.append(Spacer(1, 12))
    
    # Convert data to formatted JSON string
    json_data = json.dumps(data, indent=2, default=str)
    # Split into lines and add as paragraphs
    for line in json_data.split('\n')[:100]:  # Limit to first 100 lines
        elements.append(Paragraph(f"<font name='Courier' size='8'>{line}</font>", normal_style))
    
    # Add notes if provided
    if notes:
        elements.append(PageBreak())
        elements.append(Paragraph("Analyst Notes", heading_style))
        elements.append(Spacer(1, 12))
        elements.append(Paragraph(notes, normal_style))
    
    # Add footer
    elements.append(Spacer(1, 30))
    footer_style = ParagraphStyle(
        'Footer',
        parent=styles['Normal'],
        fontSize=8,
        textColor=colors.grey,
        alignment=TA_CENTER
    )
    elements.append(Paragraph("This report was generated by OSINT Intelligence Platform", footer_style))
    elements.append(Paragraph("For authorized use only - Handle with care", footer_style))
    
    # Build PDF
    doc.build(elements)
    
    return filepath
