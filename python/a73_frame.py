import sys

print(sys._getframe().f_code)
print(sys._getframe().f_locals)
print(sys._getframe().f_globals)

def main():
    a = 1
    print(sys._getframe().f_code)
    print(sys._getframe().f_locals)


main()
