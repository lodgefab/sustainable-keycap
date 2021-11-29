import { categoriseColor, convertHexToRgb, convertRgbToHsv } from '../helper'
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

describe('covertRgbToHsv', () => {
  test.each<
    [
      { red: number; green: number; blue: number },
      { hue: number; saturation: number; value: number }
    ]
  >([
    [
      { red: 255, green: 255, blue: 255 },
      { hue: 0, saturation: 0, value: 100 },
    ],
    [
      { red: 255, green: 0, blue: 0 },
      { hue: 0, saturation: 100, value: 100 },
    ],
    [
      { red: 0, green: 255, blue: 0 },
      { hue: 120, saturation: 100, value: 100 },
    ],
    [
      { red: 0, green: 0, blue: 255 },
      { hue: 240, saturation: 100, value: 100 },
    ],
    [
      { red: 255, green: 224, blue: 224 },
      { hue: 0, saturation: 12, value: 100 },
    ],
    [
      { red: 255, green: 89, blue: 89 },
      { hue: 0, saturation: 65, value: 100 },
    ],
    [
      { red: 205, green: 220, blue: 57 },
      { hue: 65, saturation: 74, value: 86 },
    ],
    [
      { red: 45, green: 175, blue: 90 },
      { hue: 140, saturation: 74, value: 68 },
    ],
  ])('正常にrgb -> hsvの変換ができる（%s -> %s）', (rgb, expectedHsv) => {
    const actual = convertRgbToHsv(rgb)
    expect(Math.floor(actual.hue)).toEqual(expectedHsv.hue)
    expect(Math.floor(actual.saturation)).toEqual(expectedHsv.saturation)
    expect(Math.floor(actual.value)).toEqual(expectedHsv.value)
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

  test.each<
    [
      string,
      { red: number; green: number; blue: number },
      { hue: number; saturation: number; value: number },
      CategorisedColorType
    ]
  >([
    [
      '#FFFFFF',
      { red: 255, green: 255, blue: 255 },
      { hue: 0, saturation: 0, value: 100 },
      'white',
    ],
    ['#FF0000', { red: 255, green: 0, blue: 0 }, { hue: 0, saturation: 100, value: 100 }, 'red'],
    [
      '#00FF00',
      { red: 0, green: 255, blue: 0 },
      { hue: 120, saturation: 100, value: 100 },
      'green',
    ],
    ['#0000FF', { red: 0, green: 0, blue: 255 }, { hue: 240, saturation: 100, value: 100 }, 'blue'],
    [
      '#FFE0E0',
      { red: 255, green: 224, blue: 224 },
      { hue: 0, saturation: 12, value: 100 },
      'white',
    ], // 微妙に赤みがかった白
    ['#ff5959', { red: 255, green: 89, blue: 89 }, { hue: 0, saturation: 65, value: 100 }, 'red'], // 薄い赤
    [
      '#CDDC39',
      { red: 205, green: 220, blue: 57 },
      { hue: 65, saturation: 74, value: 86 },
      'green',
    ],
  ])(
    '正常にカテゴリ分けできる（%s --> %s）',
    (testee, convertHexToRgbValue, convertRgbToHsvValue, expected) => {
      // categoriseColorの内部で呼び出しているconvertHexToRgb、convertRgbToHsvをモック化
      jest.spyOn(helper, 'convertHexToRgb').mockReturnValue(convertHexToRgbValue)
      jest.spyOn(helper, 'convertRgbToHsv').mockReturnValue(convertRgbToHsvValue)

      const actual = categoriseColor(testee)
      expect(actual).toEqual(expected)
    }
  )
})
