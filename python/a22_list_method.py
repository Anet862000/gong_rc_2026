def main():
    list_a = [1, 2, 3]
    list_b = [4, 5, 6]
    print(list_a + list_b) #리스트 합치기
    print(list_a)

    list_a.extend(list_b) #리스트 확장하기
    print(list_a)

    list_b.append(7) #리스트에 요소 추가하기
    list_b.append(8)
    print(list_b)

    list_b.insert(1, 4.5) #리스트에 요소 삽입하기
    print(list_b)

if __name__ == '__main__':
    main()