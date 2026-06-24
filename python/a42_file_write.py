from pathlib import Path

def main():
    #print(Path(__file__).parent)
    #f = open(Path(__file__).parent.parent / "data/text.exe", "w") #"data" / "text.exe"
    #f.write("안녕하세요\n")
    #f.close()

    with open(Path(__file__).parent.parent / "data/text.exe", "a", encoding='utf-8') as f:#"data" / "text.exe"
        f.write("안녕하세요\n")

if __name__ == "__main__":
    main()