import { categoriseColor, convertHexToRgb } from '../helper'
import { CategorisedColorType } from '../../types'

describe('covertHexToRgb', () => {
  test.each([
    '423io4n', // テキトーな文字列
    '#FFF', // "3桁の16進数",
    '#ZZZZZZ', // "G以降のアルファベットが混じっている",
  ])('#と6桁の16進数以外の表現の場合はエラーを返す（%s）', (testee: string) => {
    expect(() => convertHexToRgb(testee)).toThrowError(
      'カラーコードの形式がが正しくありません。"#"と16進数6桁で表現してください。'
    )
  })

  test.each<[string, number, number, number]>([
    ['#FFFFFF', 255, 255, 255],
    ['#FF0000', 255, 0, 0],
    ['#00FF00', 0, 255, 0],
    ['#0000FF', 0, 0, 255],
    ['#00FFFF', 0, 255, 255],
    ['#FF00FF', 255, 0, 255],
    ['#FFFF00', 255, 255, 0],
    ['#000000', 0, 0, 0],
    ['#320000', 50, 0, 0],
    ['#640000', 100, 0, 0],
    ['#960000', 150, 0, 0],
    ['#C80000', 200, 0, 0],
    ['#FA0000', 250, 0, 0],
  ])('正常にhex -> rgbの変換ができる（%s -> %i, %i, %i）', (testee, red, green, blue) => {
    const actual = convertHexToRgb(testee)
    expect(actual).toEqual({ red, green, blue })
  })
})

describe('categoriseColor', () => {
  let helper

  beforeEach(() => {
    helper = require('../helper')
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  test.each<[string, { red: number; green: number; blue: number }, CategorisedColorType]>([
    ['#FFFFFF', { red: 255, green: 255, blue: 255 }, 'white'],
    ['#FF0000', { red: 255, green: 0, blue: 0 }, 'red'],
    ['#00FF00', { red: 0, green: 255, blue: 0 }, 'green'],
    ['#0000FF', { red: 0, green: 0, blue: 255 }, 'blue'],
    ['#FFE0E0', { red: 255, green: 224, blue: 224 }, 'white'], // 微妙に赤みがかった白
    ['#ff5959', { red: 255, green: 89, blue: 89 }, 'red'], // 薄い赤
  ])('正常にカテゴリ分けできる（%s --> %s）', (testee, convertHexToRgbValue, expected) => {
    // categoriseColorの内部で呼び出しているconvertHexToRgbをモック化
    jest.spyOn(helper, 'convertHexToRgb').mockReturnValue(convertHexToRgbValue)

    const actual = categoriseColor(testee)
    expect(actual).toEqual(expected)
  })
})
