def terimummy(string, wpm):
    nwords = string.split(' ')
    tpw = wpm/60

    return nwords*tpw

print(terimummy('teri mummy chor hai', 18))
