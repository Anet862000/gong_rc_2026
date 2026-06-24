def call_times(func):
    for _ in range(10):
        func()

def print_hello():
    print('안녕하세요')

def main():
    temp_f = print_hello
    print(type(print_hello))
    call_times(temp_f)

if __name__ == "__main__":
    main()