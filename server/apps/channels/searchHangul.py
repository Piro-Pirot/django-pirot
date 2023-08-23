JUNGSUNG_LIST = [
    'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
]
def isJUNGSUNG(ch):
    try:
        JUNGSUNG_LIST.index(ch)
        return JUNGSUNG_LIST.index(ch)
    except:
        return False

CHOSUNG_START_LETTER = 4352
JAMO_START_LETTER = ord(u'가')
JAMO_END_LETTER = ord(u'힣')
JAMO_CYCLE = ord(u'까') - ord(u'가')
CHOSUNG_BETWEEN_ZONGSUNG = ord('ㄱ') - 4352

# 한글 초성 검색을 위한 함수
def isHangul(ch):
    #주어진 문자가 한글인지 아닌지
    JAMO_START_LETTER = ord(u'가')
    JAMO_END_LETTER = ord(u'힣')
    return ord(ch) >= JAMO_START_LETTER and ord(ch) <= JAMO_END_LETTER

def get_chosung_from_input(value):
    # 검색어의 초성 모두 추출
    search_cho = []
    # 검색어 중 자모 결합인 경우
    search_letter = ''
    for ch in value:
        print(ch)
        # 한글 자모 결합인 경우에는 search_letter 문자열을 구성
        if isHangul(ch):
            search_letter += ch
        elif isJUNGSUNG(ch):
            search_cho.append(chr(CHOSUNG_START_LETTER+isJUNGSUNG(ch)))
        else:
            search_cho.append(ch)
    return search_cho, search_letter
    

def get_chosung_from_str(element):
    element_cho = []
    # element 문자열의 초성을 모두 추출
    for ch in element:
        if isHangul(ch):
            element_cho.append(chr((ord(ch) - JAMO_START_LETTER)//JAMO_CYCLE + CHOSUNG_START_LETTER))
        elif isJUNGSUNG(ch):
            element_cho.append(chr(CHOSUNG_START_LETTER+isJUNGSUNG(ch)))
        else:
            element_cho.append(ch)
    return element_cho