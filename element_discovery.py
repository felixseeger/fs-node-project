from playwright.sync_api import sync_playwright
import json

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto('https://nodes.felixseeger.de')
        page.wait_for_load_state('networkidle')
        
        elements = page.evaluate("""
            () => {
                const results = [];
                const interactables = document.querySelectorAll('button, a, input, [role="button"]');
                interactables.forEach(el => {
                    results.push({
                        tag: el.tagName,
                        text: el.innerText || el.value || el.placeholder || '',
                        id: el.id,
                        class: el.className,
                        role: el.getAttribute('role')
                    });
                });
                return results;
            }
        """)
        print(json.dumps(elements, indent=2))
        browser.close()

if __name__ == "__main__":
    run()
