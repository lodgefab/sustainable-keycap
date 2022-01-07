module.exports = {
  global: {
    cookieConsent: {
      body: 'このサイトでは、ユーザーの訪問状況を収集するためにCookieを利用しています。',
      accept: 'Cookieの利用を許可する',
      decline: 'Cookieの利用を拒否する',
    },
  },
  home: {
    hero: {
      title1: '廃プラから',
      title2: 'キーキャップを',
      title3: '作ろう',
      button1: '購入する',
      button2: '自分でつくる',
    },
    concept: {
      description:
        '#ANYCAPは、廃棄プラスチックを使ってキーキャップを自作するオープンソースコミュニティです。家庭やオフィスで出るプラゴミを原材料としたキーキャップを製作し、手法やデータを公開することを通じて、仲間の輪を広げる活動を行なっています。',
    },
    whyAnycap: {
      subtitle: '廃プラキーキャップのススメ',
      section1: {
        label: '一般的なキーキャップ規格に準拠',
        text: 'Cherry, DSAなど、一般的な自作キーボード規格に則ったキー形状のため、お使いのキーボードにそのまま組み込みやすいです',
      },
      section2: {
        label: 'コスト抑えめ',
        text: '廃材を用いるので、原材料の費用が安く済みます',
      },
      section3: {
        label: '自分の好きな色・素材にこだわれる',
        text: '自分が本当にキーボードに欲しい色、欲しい素材で作ることができます',
      },
      section4: {
        label: 'オープンソース',
        text: '金型や作り方の情報を公開しています',
      },
    },
    shop: {
      subtitle: 'キーキャップを買う',
      text: '単色のものからマーブル模様のものまで、様々な色を取り揃えています',
      color: '各色',
      price: '500円',
      shipping: '（送料別）',
      button: '購入する',
    },
    workshop: {
      subtitle: 'ワークショップ',
      text: '自分の好きな素材を持ち込んで、世界に１つだけの廃プラキーキャップを作るワークショップを開催しています。ご興味のある方は、下のボタンよりお申し込みください。',
      programTitle: 'プログラム例：',
      programTimeline1: '10分 導入・作業説明',
      programTimeline2: '30分 素材の破砕作業',
      programTimeline3: '30分 射出成形',
      programTimeline4: '20分 まとめ・撮影タイム',
      programTimeline5: '場所：ガーデンテラス紀尾井町17F　ヤフーLODGE内',
      button: '参加する',
    },
    making: {
      subtitle: '廃プラキーキャップができるまで',
      step1Title: '素材をさがす',
      step1Text:
        'キーキャップの素材を探します。原材料を確認でき、溶かすことで有害物質が出ないものである必要があります。ペットボトルキャップなどは身近で使いやすい素材の１つです。',
      step2Title: '破砕する',
      step2Text: '集めた素材を砕いて、5mm角程度の大きさにします。',
      step3Title: '金型を用意する',
      step3Text:
        'アルミ材を切削して金型を作ります。このとき、型で抜ける構造になっていることに注意します',
      step4Title: '射出成形する',
      step4Text: '思い切りレバーを引いて、溶かした素材を金型に流し込みます',
    },
    mold: {
      subtitle: '金型',
      text1:
        '金型を用意し、家庭用の射出成形機（ORIGINALMIND社製のINARIなど）を使えば、ご自身でキーキャップを作ることも可能です。',
      text2:
        'より多くの方に活動に参加してもらいたいという思いから、金型の3Dデータを公開しています。',
      text3: 'ご興味のある方は、下記のコンタクトフォームよりお問い合わせください',
      button: 'ダウンロードする',
    },
    aboutUs: {
      subtitle: 'わたしたちについて',
      text1:
        '#ANYCAPは、ヤフー社員の自主制作チームToasterによって運営されており、オープンコラボレーションハブLODGEを拠点に活動しています。',
      text2:
        '#ANYCAPプロジェクトは、協業いただける企業・団体・個人のみなさまをお待ちしております。',
      button: 'お問い合わせ',
    },
    library: {
      subtitle: 'ライブラリ ',
      text: 'みんなが見つけたキーキャップに使えそうな素材とそのレポートです。実際に作ってみたものがあればどんどう投稿していってみましょう！いいねの多い人気素材は実際に販売されることがあるかも...?!',
      button: '素材を追加する',
    },
  },
  editor: {
    title: {
      text: '素材を追加する',
    },
    form: {
      name: '素材の名前',
      color: '色の系統',
      plastic: 'プラスチックの種類',
      plasticOptionLabel: '選択してください',
      plasticOption1: 'PP（ポリプロピレン）',
      plasticOption2: 'PE（ポリエチレン）',
      plasticOption3: 'PS（ポリスチレン）',
      temperature: '設定温度',
      note: '備考（制作する際のポイントなど）',
      submit: '登録する',
    },
  },
  login: {
    text: 'キーキャップ素材を投稿するにはログインが必要です。',
  },
}
