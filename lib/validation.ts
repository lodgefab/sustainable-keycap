import * as yup from 'yup'
import { hexColorTypeItems, plasticTypeItems } from '../types'

/**
 * 素材登録フォームのバリデーション要件
 */
export const schema = yup
  .object()
  .shape({
    // 廃プラ素材の画像: 画像は一度に1つまで、画像サイズは1MB以下
    plasticImage: yup
      .mixed()
      .required()
      // UI上、同時に選択できるファイルは1つのはずだが、何らかの理由で2つ以上のファイルが選択された場合は弾く
      .test('fileCount', 'Only one file can be selected at a time.', (files) => files.length === 1)
      // ファイルサイズが1MBを超えるものは弾く
      // 記述したtest()の実行順は保証されず、ファイル数が1でない場合もここのテストが実行されてしまうため、
      // ファイル数が1でない場合はファイルサイズのチェックは行わずここのテストは通す（上記のテストで弾かれるはず）
      .test(
        'fileSize',
        'The maximum file size is 1MB.',
        (files) => files.length !== 1 || files[0].size < 1000000
      ),

    // キーキャップの画像: 画像は一度に1つまで、画像サイズは1MB以下
    keycapImage: yup
      .mixed()
      .required()
      // UI上、同時に選択できるファイルは1つのはずだが、何らかの理由で2つ以上のファイルが選択された場合は弾く
      .test('fileCount', 'Only one file can be selected at a time.', (files) => files.length === 1)
      // ファイルサイズが1MBを超えるものは弾く
      // 記述したtest()の実行順は保証されず、ファイル数が1でない場合もここのテストが実行されてしまうため、
      // ファイル数が1でない場合はファイルサイズのチェックは行わずここのテストは通す（上記のテストで弾かれるはず）
      .test(
        'fileSize',
        'The maximum file size is 1MB.',
        (files) => files.length !== 1 || files[0].size < 1000000
      ),

    // 素材名: 入力必須
    materialName: yup.string().required(),

    // 色の種類: 入力必須、かつ選択肢から外れた入力は受け付けない
    hexColor: yup
      .string()
      .required()
      .test('matchWithColorType', (value) => hexColorTypeItems.includes(value!)),

    // プラスチックの種類: 入力必須、かつ選択肢から外れた入力は受け付けない
    plasticType: yup
      .string()
      .required()
      .test('matchWithPlasticType', (value) => plasticTypeItems.includes(value!)),

    // 設定温度: 入力必須、正の整数
    celsius: yup
      .number()
      .integer()
      .min(0)
      .transform((value, originalValue) => {
        if (typeof originalValue === 'string' && originalValue === '') {
          return null
        }
        return value
      })
      .nullable()
      .required(),

    // 備考: 特にバリデーション要件は無し
    note: yup.string(),
  })
  .required()
