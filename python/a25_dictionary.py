import json
from pathlib import Path
def main():
    dict_a = dict()
    dict_a = {'a' : 'aa'}
    print(type(dict_a))

    #원소 추가
    dict_a['b'] = 'bbb'
    print(dict_a)
    print(dict_a['a'], dict_a['b'], dict_a.get('c')) #get은 key가 없으면 default값 반환

    print(dict_a.pop('a'))
    print(dict_a)

    dict_a['a'] = 'aa'
    dict_a['b'] = 'bbb'
    dict_a['c'] = 'cccc'
    dict_a['d'] = 'ddddd'

    for key in dict_a:
        print(key, dict_a[key])

    for key, value in dict_a.items():
        print(key, value)

    print(dict_a.keys())
    print(dict_a.values())

    with open(Path(__file__).parent.parent / "data/dict_a.json", "w", encoding='utf-8') as f:
        json.dump(dict_a, f, ensure_ascii=False, indent=4)

if __name__ == '__main__':
    main()