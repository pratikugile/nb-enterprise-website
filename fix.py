import glob, re

html_files = glob.glob('*.html')

for f in html_files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    pattern = re.compile(r'(<div class="footer-grid">\s*<div[^>]*>).*?(?=^\s*<div>\s*<h4>Quick Links</h4>)', re.DOTALL | re.MULTILINE)
    
    replacement = r'''\g<1>
                    <a href="index.html" class="footer-logo logo" style="margin-bottom: 20px;">
                        <span class="logo-n">N</span>
                        <div class="logo-icon-wrapper">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 0v12a6 6 0 006 6h10" stroke="var(--primary-color)" stroke-width="4" fill="none" />
                                <path d="M10 22 C10 23.1 9.1 24 8 24 C6.9 24 6 23.1 6 22 C6 20.5 8 18 8 18 C8 18 10 20.5 10 22 Z" fill="var(--bg-white)"/>
                            </svg>
                        </div>
                        <span class="logo-b">B</span>
                        <div class="logo-text-wrapper">
                            <span class="logo-text-main">Enterprises</span>
                            <span class="logo-text-sub" style="color: #BBBBBB;">Precision Tooling</span>
                        </div>
                    </a>
                    <p>NB Enterprises is a trusted manufacturer of precision tube bending tooling, providing high-quality dies and mandrels to industries across India.</p>
                </div>
                
'''
    new_content = pattern.sub(replacement, content)
    
    with open(f, 'w', encoding='utf-8') as file:
        file.write(new_content)
print('Fixed layout in all HTML files!')
