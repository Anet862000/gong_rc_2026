import datetime

def main():
    now = datetime.datetime.now()

    if 9 < now.hour < 12:
        print(f"현재 시간은 {now.hour}시로 오전입니다.")
    elif now.hour < 9:
        print(f"현재 시간은 {now.hour}시로 새벽입니다.")
    else:
        print(f"현재 시간은 {now.hour}시로 오후입니다.")


    print(now.month, type(now.month))

    if now.month == 12 or 1 <= now.month <= 3:
        print("겨울")
    elif 4 <= now.month <= 5:
        print("봄")
    elif 6 <= now.month <= 8:
        print("여름")
    else:
        print("가을")

if __name__ == "__main__":
    main()