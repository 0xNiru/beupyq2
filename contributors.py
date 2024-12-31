import os
import requests

OWNER = "NemesisRoy"  
REPO = "beupyq2"   

API_URL = f"https://api.github.com/repos/{OWNER}/{REPO}/contributors"
HEADERS = {"Authorization": f"token {os.getenv('GITHUB_TOKEN')}"}


def fetch_contributors():
    response = requests.get(API_URL, headers=HEADERS)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error fetching contributors: {response.status_code}, {response.text}")
        return []


def update_readme(contributors):
    
    with open("README.md", "r") as file:
        content = file.readlines()

    
    contributors_section = ["\n## Contributors\n\n"]
    for contributor in contributors:
        contributors_section.append(
            f"- ![Avatar]({contributor['avatar_url']}&s=40) "  
            f"[{contributor['login']}]({contributor['html_url']}) - "
            f"{contributor['contributions']} contributions\n"
        )

    
    if "## Contributors" in "".join(content):
        start_index = next(i for i, line in enumerate(content) if line.strip() == "## Contributors")
        content = content[:start_index] + contributors_section
    else:
        content += contributors_section

   
    with open("README.md", "w") as file:
        file.writelines(content)


if __name__ == "__main__":
    contributors = fetch_contributors()
    if contributors:
        update_readme(contributors)
        print("README.md updated successfully.")
    else:
        print("No contributors found.")
