from urllib import request

def main():
    a = request.urlopen("https://naver.com")
    print(a.read())

if __name__ == "__main__":
    main()