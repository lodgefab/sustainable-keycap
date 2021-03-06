import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import styled from '@emotion/styled'
import { color, curve, font, media, zIndex } from '../../styles'
import Image from 'next/image'
import { Button } from '../atoms/Button'
import { CategorisedColorType, Material } from '../../types'
import { AuthContext } from '../../lib/auth'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Slider from 'react-slick'
import { MaterialItem } from '../molecules/MaterialItem'
import { useWindowSize } from '../../utils/useWindowSize'
import { Footer } from '../molecules/Footer'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { Loader } from '../molecules/Loader'
import Scroll from 'react-scroll'
import { getAuth } from 'firebase/auth'
import { useTranslation } from 'next-i18next'
import { UsePageLoadEventContext } from '../../utils/pageLoadEventContext'
import { useRouter } from 'next/router'
import LoginModal from '../molecules/LoginModal'

gsap.registerPlugin(ScrollTrigger)

type Props = {
  materials: Material[]
  setGoodCount: (materialId: string, count: number) => void
  canUpvote: boolean
  upvotedMaterialsId: string[] | 'initializing' | null
  upvote: Function
}

export const Home: React.VFC<Props> = ({
  materials,
  setGoodCount,
  canUpvote,
  upvotedMaterialsId,
  upvote,
}) => {
  const authStatus = useContext(AuthContext)
  const usePageLoadEvent = useContext(UsePageLoadEventContext)
  const [isLoginModalActive, setLoginModalActive] = useState(false)
  const { query } = useRouter()
  const { currentUser } = getAuth()

  //▼▼▼▼▼▼▼▼演出処理開始 ▼▼▼▼▼▼▼//
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  }
  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      document.body.style.height = `${entries[0].contentRect.height}px`
    })

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }
  }, [])

  const size = useWindowSize()

  const setBodyHeight = () => {
    document.body.style.height = `${containerRef.current?.getBoundingClientRect().height}px`
  }

  const setAnimation = () => {
    // 各sectionをarray化
    let sections = gsap.utils.toArray('.section')
    // let container = document.querySelector(".container")
    console.log(sections)

    // Heading Animationの動きをテンプレ化
    const animationFromHeading = {
      y: '150%',
      rotate: 15,
    }
    const animationToHeading = {
      y: '0%',
      rotate: 0,
      stagger: 0.04,
    }

    smoothScroll('.content', '.allWrap', 1)

    gsap.set('.headline_why', { ...animationFromHeading }) //Workshopセクション
    ScrollTrigger.batch('.headline_why', {
      onEnter: (batch) => gsap.to(batch, { ...animationToHeading }),
      start: 'top 90%',
      once: true, //この指定によって１度だけアニメーションされる
    })
    gsap.set('.headline_workshop', { ...animationFromHeading }) //Workshopセクション
    ScrollTrigger.batch('.headline_workshop', {
      onEnter: (batch) => gsap.to(batch, { ...animationToHeading }),
      start: 'top 90%',
      once: true, //この指定によって１度だけアニメーションされる
    })
    gsap.set('.headline_making', { ...animationFromHeading }) //Makingセクション
    ScrollTrigger.batch('.headline_making', {
      onEnter: (batch) => gsap.to(batch, { ...animationToHeading }),
      start: 'top 50%',
      once: true, //この指定によって１度だけアニメーションされる
    })
    gsap.set('.headline_mold', { ...animationFromHeading }) //Moldセクション
    ScrollTrigger.batch('.headline_mold', {
      onEnter: (batch) => gsap.to(batch, { ...animationToHeading }),
      start: 'top 50%',
      once: true, //この指定によって１度だけアニメーションされる
    })
    gsap.set('.headline_about', { ...animationFromHeading }) //AboutUsセクション
    ScrollTrigger.batch('.headline_about', {
      onEnter: (batch) => gsap.to(batch, { ...animationToHeading }),
      start: 'top 50%',
      once: true, //この指定によって１度だけアニメーションされる
    })
    gsap.set('.headline_library', { ...animationFromHeading }) //Libraryセクション
    ScrollTrigger.batch('.headline_library', {
      onEnter: (batch) => gsap.to(batch, { ...animationToHeading }),
      start: 'top 50%',
      once: true, //この指定によって１度だけアニメーションされる
    })

    gsap.fromTo(
      '.conceptImg',
      { x: 0 },
      {
        // xPercent: -100,
        x: () => -1 * innerWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: '.conceptImg',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          // pin: true,
          // invalidateOnRefresh: true,
          // anticipatePin: 1
        },
      }
    )

    //makingセクション
    // const makingImg = gsap.utils.toArray('.makingItemImg')
    // for (const key of Object.keys(makingImg)) {
    //   const img = makingImg[key]
    //   gsap
    //     .timeline({
    //       defaults: { ease: 'none' },
    //       scrollTrigger: {
    //         scroller: img.closest('.makingItems'),
    //         horizontal: true,
    //         trigger: img.closest('.makingItem'),
    //         start: 'left right',
    //         end: 'left left',
    //         scrub: true,
    //       },
    //     })
    //     .fromTo(img, { x: 250 }, { x: -250 }, 0)
    //     .from(img.nextElementSibling, { scale: 0.8 }, 0)
    // }
  }

  const StartOnLoadAnimation = () => {
    //読み込み完了時にLoaderをフェードアウト
    gsap
      .timeline({ defaults: { duration: 1.6, ease: 'expo' } })
      .from('.loader', {
        opacity: 1,
      })
      .to('.loader', {
        opacity: 0,
      })
    gsap
      .timeline({ defaults: { duration: 0.1, ease: 'expo', delay: 1.6 } })
      .from('.loader', {
        display: 'flex',
      })
      .to('.loader', {
        display: 'none',
      })
    //ロード時にキーキャップが出現する
    gsap
      .timeline({ defaults: { duration: 0.8, ease: 'expo', delay: 1.0 } })
      .set('.key', {
        opacity: 0,
        y: '150%',
      })
      .to('.key', {
        opacity: 1,
        y: '0%',
        stagger: {
          each: 0.08,
          from: 'start',
        },
      })
    //ロード時に文字が出現する
    gsap.killTweensOf('.titleline')
    gsap
      .timeline({ defaults: { duration: 1.2, ease: 'expo', delay: 1.0 } })
      .set('.titleline', {
        y: '150%',
        rotate: 15,
      })
      .to('.titleline', {
        y: '0%',
        rotate: 0,
        stagger: 0.04,
      })
  }

  usePageLoadEvent(() => {
    if (process.browser) {
      setBodyHeight()
      gsap.registerPlugin(ScrollTrigger)
      setAnimation()
      StartOnLoadAnimation()
      if (
        typeof query['to'] === 'string' &&
        ['workshop', 'mold', 'aboutus', 'library'].includes(query['to'])
      ) {
        Scroll.scroller.scrollTo(query['to'], {
          smooth: true,
          delay: 1000,
          duration: 500,
          offset: 72,
        })
      }
    }
  })

  // this is the helper function that sets it all up. Pass in the content <div> and then the wrapping viewport <div> (can be the elements or selector text). It also sets the default "scroller" to the content so you don't have to do that on all your ScrollTriggers.
  const smoothScroll = (content, viewport, smoothness) => {
    content = gsap.utils.toArray(content)[0]
    smoothness = smoothness || 1

    gsap.set(viewport || content.parentNode, {
      overflow: 'hidden',
      position: 'fixed',
      height: '100%',
      width: '100%',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    })
    gsap.set(content, { overflow: 'visible', width: '100%' })

    let getProp = gsap.getProperty(content),
      setProp = gsap.quickSetter(content, 'y', 'px'),
      setScroll = ScrollTrigger.getScrollFunc(window),
      removeScroll = () => (content.style.overflow = 'visible'),
      killScrub = (trigger) => {
        let scrub = trigger.getTween ? trigger.getTween() : gsap.getTweensOf(trigger.animation)[0] // getTween() was added in 3.6.2
        scrub && scrub.kill()
        trigger.animation.progress(trigger.progress)
      },
      height,
      isProxyScrolling

    function refreshHeight() {
      height = content.clientHeight
      content.style.overflow = 'visible'
      document.body.style.height = height + 'px'
      return height - document.documentElement.clientHeight
    }

    ScrollTrigger.addEventListener('refresh', () => {
      removeScroll()
      requestAnimationFrame(removeScroll)
    })
    ScrollTrigger.defaults({ scroller: content })

    ScrollTrigger.scrollerProxy(content, {
      scrollTop(value) {
        if (arguments.length && value) {
          isProxyScrolling = true // otherwise, if snapping was applied (or anything that attempted to SET the scroll proxy's scroll position), we'd set the scroll here which would then (on the next tick) update the content tween/ScrollTrigger which would try to smoothly animate to that new value, thus the scrub tween would impede the progress. So we use this flag to respond accordingly in the ScrollTrigger's onUpdate and effectively force the scrub to its end immediately.
          setProp(-value)
          setScroll(value)
          return
        }
        return -getProp('y')
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight }
      },
    })

    return ScrollTrigger.create({
      animation: gsap.fromTo(
        content,
        { y: 0 },
        {
          y: () => document.documentElement.clientHeight - height,
          ease: 'none',
          onUpdate: ScrollTrigger.update,
        }
      ),
      scroller: window,
      invalidateOnRefresh: true,
      start: 0,
      end: refreshHeight,
      refreshPriority: -999,
      scrub: smoothness,
      onUpdate: (self) => {
        if (isProxyScrolling) {
          killScrub(self)
          isProxyScrolling = false
        }
      },
      onRefresh: killScrub, // when the screen resizes, we just want the animation to immediately go to the appropriate spot rather than animating there, so basically kill the scrub.
    })
  }

  useEffect(() => {
    setBodyHeight()
  }, [size.height])

  //▲▲▲▲▲▲▲▲▲▲▲ 演出処理終了 ▲▲▲▲▲▲▲▲▲▲▲//

  const [currentFilter, setCurrentFilter] = useState<CategorisedColorType | null>(null)
  const { t } = useTranslation('translation', { keyPrefix: 'home' })
  const { i18n } = useTranslation()
  const isJa = i18n.language == 'ja'

  const updateFilter = (newFilter: CategorisedColorType) => {
    setCurrentFilter(currentFilter === newFilter ? null : newFilter)
  }

  return (
    <AllWrap className='allWrap'>
      <Loader />
      <LoginModal isActive={isLoginModalActive} deActivate={() => setLoginModalActive(false)} />
      <div className='content' ref={containerRef}>
        <Hero id='hero' color={'transparent'} className='section hero'>
          <BGKeys className={'parallax'} data-speed='.4'>
            <BGKey
              className={'key'}
              src={'/images/photos/key004.jpg'}
              gridRow={7}
              gridColumn={43}
            />
            <BGKey
              className={'key'}
              src={'/images/photos/key006.jpg'}
              gridRow={18}
              gridColumn={-12}
            />
            <BGKey
              className={'key'}
              src={'/images/photos/key003.jpg'}
              gridRow={32}
              gridColumn={41}
            />
            <BGKey
              className={'key'}
              src={'/images/photos/key001.jpg'}
              gridRow={27}
              gridColumn={29}
            />
            <BGKey
              className={'key'}
              src={'/images/photos/key002.jpg'}
              gridRow={1}
              gridColumn={32}
            />
            <BGKey
              className={'key'}
              src={'/images/photos/key002.jpg'}
              gridRow={30}
              gridColumn={14}
            />
            <BGKey
              className={'key'}
              src={'/images/photos/key004.jpg'}
              gridRow={44}
              gridColumn={34}
            />
          </BGKeys>
          <VideoWrap>
            <VideoPlayer>
              <iframe
                src='https://www.youtube.com/embed/gA8jTbitJ5E?autoplay=1&mute=1&playsinline=1&loop=1&playlist=gA8jTbitJ5E&controls=0&disablekb=1'
                frameBorder='0'
                allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen
              ></iframe>
            </VideoPlayer>
            <VideoMask></VideoMask>
            <Image
              src={'/images/photos/000.jpg'}
              width={400}
              height={400}
              objectFit='cover'
              objectPosition='center center'
              layout='responsive'
            />
          </VideoWrap>
          <TitleWrap>
            <Title>
              <span>
                <h1 className={'titleline'}>{t('hero.title1')}</h1>
              </span>
              <span>
                <h1 className={'titleline'}>{t('hero.title2')}</h1>
              </span>
              <span>
                <h1 className={'titleline'}>{t('hero.title3')}</h1>
              </span>
            </Title>
            <HeroButtonsWrap>
              <span>
                <HeroButton
                  onClick={() => Scroll.scroller.scrollTo('shop', { smooth: true, duration: 500 })}
                  className={'titleline'}
                  label={`${t('hero.button1')}`}
                  iconPath={'/images/icons/shop.svg'}
                  iconSize={32}
                  bgColor={'#ffffff'}
                />
              </span>
              <span>
                <HeroButton
                  label={`${t('hero.button2')}`}
                  onClick={() =>
                    Scroll.scroller.scrollTo('workshop', { smooth: true, duration: 500 })
                  }
                  className={'titleline'}
                  iconPath={'/images/icons/make.svg'}
                  iconSize={32}
                  bgColor={'#ffffff'}
                />
              </span>
            </HeroButtonsWrap>
          </TitleWrap>
        </Hero>
        <ConceptSection id='concept' color={'transparent'} className='section concept'>
          <Wrap>
            <Message>{t('concept.description')}</Message>
          </Wrap>
          <ConceptPhotos className={'conceptImg'}>
            <ConceptPhoto src='/images/photos/003.jpg' />
            <ConceptPhoto src='/images/photos/002.jpg' />
            <ConceptPhoto src='/images/photos/001.jpg' />
            <ConceptPhoto src='/images/photos/004.jpg' />
            <ConceptPhoto src='/images/photos/005.jpg' />
          </ConceptPhotos>
        </ConceptSection>
        <WHYSection id='why' color={'transparent'} className='section why'>
          <WHYWrap>
            <SectionTitleGroup>
              <span>
                <SectionTitle className={'headline_why'}>Why #ANYCAP ?</SectionTitle>
              </span>
              {isJa ? (
                <span>
                  <SectionSubTitle className={'headline_why'}>
                    {t('whyAnycap.subtitle')}
                  </SectionSubTitle>
                </span>
              ) : null}
            </SectionTitleGroup>
            <WhyKeys>
              <WhyKey>
                <img src='/images/icons/point001.svg' />
                <h4>{t('whyAnycap.section1.label')}</h4>
                <p>{t('whyAnycap.section1.text')}</p>
              </WhyKey>
              <WhyKey>
                <img src='/images/icons/point002.svg' />
                <h4>{t('whyAnycap.section2.label')}</h4>
                <p>{t('whyAnycap.section2.text')}</p>
              </WhyKey>
              <WhyKey>
                <img src='/images/icons/point003.svg' />
                <h4>{t('whyAnycap.section3.label')}</h4>
                <p>{t('whyAnycap.section3.text')}</p>
              </WhyKey>
              <WhyKey>
                <img src='/images/icons/point004.svg' />
                <h4>{t('whyAnycap.section4.label')}</h4>
                <p>{t('whyAnycap.section4.text')}</p>
              </WhyKey>
            </WhyKeys>
          </WHYWrap>
        </WHYSection>
        <ShopSection id='shop' color={'transparent'} className='section shop'>
          <ShopWrap>
            <WorkShopImgWrap>
              <WorkShopImg src='/images/photos/013.jpg' />
            </WorkShopImgWrap>
            <WorkShopSectionTitle>
              <span>
                <SectionTitle className={'headline_Shop'}>Shop</SectionTitle>
              </span>
              {isJa && (
                <span>
                  <SectionSubTitle className={'headline_Shop'}>
                    {t('shop.subtitle')}
                  </SectionSubTitle>
                </span>
              )}
            </WorkShopSectionTitle>
            <WorkShopSectionContents>
              <WorkshopDesc>{t('shop.text')}</WorkshopDesc>
              <Divider />
              <WorkshopInfo>
                <Price>
                  <span>{t('shop.color')}</span>
                  {t('shop.price')}
                  <span>{t('shop.shipping')}</span>
                </Price>
                <Button
                  label={`${t('shop.button')}`}
                  href={
                    isJa
                      ? 'https://booth.pm/ja/items/3423801'
                      : 'https://bazar.preciousplastic.com/products/household/bottle-cap-keycap/'
                  }
                />
              </WorkshopInfo>
            </WorkShopSectionContents>
          </ShopWrap>
        </ShopSection>
        <WorkshopSection id='workshop' color={'transparent'} className='section workshop'>
          <WorkshopWrap>
            <WorkShopImgWrap>
              <WorkShopImg src='/images/photos/006.jpg' />
            </WorkShopImgWrap>
            <WorkShopSectionTitle>
              <span>
                <SectionTitle className={'headline_workshop'}>Workshop</SectionTitle>
              </span>
              {isJa && (
                <span>
                  <SectionSubTitle className={'headline_workshop'}>
                    {t('workshop.subtitle')}
                  </SectionSubTitle>
                </span>
              )}
            </WorkShopSectionTitle>
            <WorkShopSectionContents>
              <WorkshopDesc>{t('workshop.text')}</WorkshopDesc>
              <Program>
                <ProgramLabel>{t('workshop.programTitle')}</ProgramLabel>
                <ProgramDesc>
                  {t('workshop.programTimeline1')}
                  <br />
                  {t('workshop.programTimeline2')}
                  <br />
                  {t('workshop.programTimeline3')}
                  <br />
                  {t('workshop.programTimeline4')}
                  <br />
                  <br />
                  {t('workshop.programTimeline5')}
                </ProgramDesc>
              </Program>
              <Divider />
              <WorkshopInfo>
                {/* <Price>
                  1200円<span>（材料費・実費）</span>
                </Price> */}
                <Button
                  label={`${t('workshop.button')}`}
                  href={'https://anycap-workshop.peatix.com'}
                />
              </WorkshopInfo>
            </WorkShopSectionContents>
          </WorkshopWrap>
        </WorkshopSection>

        <MakingSection id='making' color={'transparent'} className='section making'>
          <MakingWrap>
            <SectionTitleGroup>
              <span>
                <SectionTitle className={'headline_making'}>Making #ANYCAP</SectionTitle>
              </span>
              {isJa && (
                <span>
                  <SectionSubTitle className={'headline_making'}>
                    {t('making.subtitle')}
                  </SectionSubTitle>
                </span>
              )}
            </SectionTitleGroup>
            <MakingScrollWrap>
              <MakingItem className='makingItem'>
                <MakingItemImg className='makingItemImg' src={'/images/photos/007.jpg'} />
                <h3>
                  <span>01.</span>
                  {t('making.step1Title')}
                </h3>
                <p>{t('making.step1Text')}</p>
              </MakingItem>
              <MakingItem className='makingItem'>
                <MakingItemImg className='makingItemImg' src={'/images/photos/008.jpg'} />
                <h3>
                  <span>02.</span>
                  {t('making.step2Title')}
                </h3>
                <p>{t('making.step2Text')}</p>
              </MakingItem>
              <MakingItem className='makingItem'>
                <MakingItemImg className='makingItemImg' src={'/images/photos/009.jpg'} />
                <h3>
                  <span>03.</span>
                  {t('making.step3Title')}
                </h3>
                <p>{t('making.step3Text')}</p>
              </MakingItem>
              <MakingItem className='makingItem'>
                <MakingItemImg className='makingItemImg' src={'/images/photos/010.jpg'} />
                <h3>
                  <span>04.</span>
                  {t('making.step4Title')}
                </h3>
                <p>{t('making.step4Text')}</p>
              </MakingItem>
            </MakingScrollWrap>
          </MakingWrap>
        </MakingSection>
        <MoldSection id='mold' color={'transparent'} className='section mold'>
          <MoldWrap>
            <MoldSliderWrap>
              <MoldSlider>
                <Slider {...sliderSettings}>
                  <SlideImg src={'/images/photos/011.jpg'} />
                  <SlideImg src={'/images/photos/011.jpg'} />
                  <SlideImg src={'/images/photos/011.jpg'} />
                  <SlideImg src={'/images/photos/011.jpg'} />
                </Slider>
              </MoldSlider>
            </MoldSliderWrap>
            <MoldTitleWrap>
              <span>
                <SectionTitle className={'headline_mold'}>Mold</SectionTitle>
              </span>
              {isJa && (
                <span>
                  <SectionSubTitle className={'headline_mold'}>
                    {t('mold.subtitle')}
                  </SectionSubTitle>
                </span>
              )}
            </MoldTitleWrap>
            <MoldContentsWrap>
              <MoldDesc>
                {t('mold.text1')}
                <br />
                {t('mold.text2')}
                <br />
                {t('mold.text3')}
              </MoldDesc>
              <Divider />
              {/* <Download href={'/'}>ダウンロードする</Download> */}
              <DownloadButton
                href={'https://vernacular.booth.pm/items/3457801'}
                label={`${t('mold.button')}`}
              />
            </MoldContentsWrap>
          </MoldWrap>
        </MoldSection>
        <AboutSection id='aboutus' color={'transparent '} className='section about'>
          <AboutWrap>
            <AboutTitleWrap>
              <span>
                <SectionTitle className={'headline_about'}>About Us</SectionTitle>
              </span>
              {isJa && (
                <span>
                  <SectionSubTitle className={'headline_about'}>
                    {t('aboutUs.subtitle')}
                  </SectionSubTitle>
                </span>
              )}
            </AboutTitleWrap>
            <AboutContentsWrap>
              <p>
                {t('aboutUs.text1')}
                <br />
                {t('aboutUs.text2')}
              </p>
              <AboutDivider />
              <Button
                label={`${t('aboutUs.button')}`}
                href={
                  isJa
                    ? 'https://forms.gle/beWyuZMBuo2zrEZP8'
                    : 'https://forms.gle/HWheDW8FM39EB1Su7'
                }
              />
            </AboutContentsWrap>
            <AboutImageWrap>
              <Image
                src='/images/photos/012.jpg'
                alt={'Yahoo! LODGE'}
                width={495}
                height={360}
                layout='responsive'
              />
            </AboutImageWrap>
          </AboutWrap>
        </AboutSection>
        <LibrarySection id='library' color={'transparent'} className='section library'>
          <LibraryWrap>
            <SectionTitleGroup>
              <span>
                <SectionTitle className={'headline_library'}>Library</SectionTitle>
              </span>
              {isJa && (
                <span>
                  <SectionSubTitle className={'headline_library'}>
                    {t('library.subtitle')}
                  </SectionSubTitle>
                </span>
              )}
            </SectionTitleGroup>
            <LibraryDesc>{t('library.text')}</LibraryDesc>
            {materials.length > 0 && ( // 何らかの理由で素材リストが取れなかった時はsection全体を非表示にする
              <>
                <Filters className='filter'>
                  <Filter isSelected={currentFilter === 'red'} onClick={() => updateFilter('red')}>
                    <Palette isSelected={currentFilter === 'red'} color={color.subColor.red} />
                    Red
                  </Filter>
                  <Filter
                    isSelected={currentFilter === 'blue'}
                    onClick={() => updateFilter('blue')}
                  >
                    <Palette isSelected={currentFilter === 'blue'} color={color.subColor.blue} />
                    Blue
                  </Filter>
                  <Filter
                    isSelected={currentFilter === 'green'}
                    onClick={() => updateFilter('green')}
                  >
                    <Palette isSelected={currentFilter === 'green'} color={color.subColor.green} />
                    Green
                  </Filter>
                  <Filter
                    isSelected={currentFilter === 'black'}
                    onClick={() => updateFilter('black')}
                  >
                    <Palette isSelected={currentFilter === 'black'} color={color.subColor.dark} />
                    Black
                  </Filter>
                  <Filter
                    isSelected={currentFilter === 'white'}
                    onClick={() => updateFilter('white')}
                  >
                    <Palette isSelected={currentFilter === 'white'} color={color.content.white} />
                    White
                  </Filter>
                </Filters>
                <MaterialGrid>
                  {materials
                    .filter(
                      (material) =>
                        currentFilter === null || material.categorisedColor === currentFilter
                    )
                    .map((material) => (
                      <MaterialItem
                        key={`material-${material.id}`}
                        plasticImageUrl={material.plasticImageUrl}
                        keycapImageUrl={material.keycapImageUrl}
                        id={material.id}
                        materialName={material.materialName}
                        celsius={material.celsius}
                        plasticType={material.plasticType}
                        goodCount={material.goodCount}
                        upvoteButtonState={
                          canUpvote
                            ? upvotedMaterialsId!.includes(material.id)
                              ? 'UPVOTED'
                              : 'NOT_UPVOTED'
                            : 'NOT_PERMITTED'
                        }
                        upvote={upvote}
                      />
                    ))}
                </MaterialGrid>

                {/* 登録ページへのリンクはログイン中のみ有効にする */}
                {authStatus === 'LOGGED_IN' && currentUser ? (
                  <Button label={`${t('library.button')}`} href='/register' />
                ) : (
                  <Button
                    label={`${t('library.button')}`}
                    onClick={() => {
                      setLoginModalActive(true)
                    }}
                  />
                )}
              </>
            )}
          </LibraryWrap>
        </LibrarySection>
        <Footer className='section footer' />
      </div>
    </AllWrap>
  )
}
const AllWrap = styled.main`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
  z-index: ${zIndex.base};
`

const Section = styled.section<{ color: string }>`
  padding: 128px 0px;
  width: 100%;
  background-color: ${(props) => `${props.color}`};
`

const Wrap = styled.div`
  max-width: 990px;
  margin: 0 auto;
  text-align: center;
  display: flex;
  /* flex-direction: row; */
  justify-content: center;
  align-items: flex-start;
  ${media.mdsp} {
    flex-direction: column;
    padding: 0 32px;
  }
`

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${color.background.dark};
`
const DesktopBr = styled.br`
  ${media.md} {
    display: none;
  }
`

const SectionTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  margin: 0 0 64px 0;
  ${media.mdsp} {
    margin: 0 0 64px 0;
  }

  span {
    overflow: hidden;
    display: block;
    line-height: 1;
  }
`

const SectionTitle = styled.h3`
  display: inline-block;
  ${font.courier.h2};
  color: ${color.content.dark};
  text-align: left;
  margin: 0 0 8px 0;
  transform-origin: 0% 50%;
`

const SectionSubTitle = styled.p`
  display: inline-block;
  ${font.inter.label};
  color: ${color.content.dark};
  text-align: left;
  transform-origin: 0% 50%;
`

const Hero = styled(Section)`
  position: relative;
  padding: 56px 0 0px 0;
  ${media.lg} {
    height: calc(100vw * 2 / 3);
  }
  ${media.sp} {
    padding: 56px 0 0 0;
  }
`
const TitleWrap = styled.div`
  position: absolute;
  left: calc(100vw * 2 / 3);
  top: 36%;
  ${media.mdsp} {
    position: relative;
    left: 0;
    top: 0;
    margin: 32px 32px 0 32px;
  }
  ${media.md} {
    margin: 64px auto 0;
    padding: 0 32px;
  }
`

const Title = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(1, 1fr);
  grid-template-rows: repeat(3, 1fr);
  ${font.inter.h1};
  font-weight: bold;
  line-height: 180%;

  ${media.mdsp} {
    max-width: 990px;
    ${font.inter.h2};
    line-height: 150%;
  }
  ${media.md} {
    ${font.inter.h1};
  }

  h1 {
    display: inline-block;
    transform-origin: 0% 50%;
    transform: translate(0, 150%);
  }

  span {
    display: block;
    line-height: 1;
    overflow: hidden;
  }
`
const HeroButtonsWrap = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr 1fr;
  margin: 64px 0 0;
  ${media.sp} {
    margin: 32px 0 0;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }
  span {
    display: block;
    line-height: 1;
    overflow: hidden;
    padding: 0 16px 16px 0;
  }
`
const HeroButton = styled(Button)`
  transform-origin: 0% 50%;
  transform: translate(0, 150%);
  width: 100%;
  padding: 0 16px 0 16px;
  :last-child {
    margin: 0 0 0 0;
  }
`

const VideoWrap = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: calc(100vw * 2 / 3);
  height: calc(100vw * 2 / 3);
  background-color: ${color.background.white};
  overflow: hidden;
  z-index: ${zIndex.behind};
  ${media.sp} {
    position: relative;
    width: calc(100vw - 32px);
    height: calc(100vw - 32px);
  }
  ${media.md} {
    position: relative;
    width: calc(100vw - 128px);
    height: calc(100vh * 2 / 3);
  }
`

const VideoMask = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('/images/mask.svg');
  background-size: cover;
  ${media.mdsp} {
    display: none;
  }
`

const VideoPlayer = styled.div`
  position: relative;
  height: 100%;
  background: #ffffff;
  overflow: hidden;
  // 動画描画部分の右端・下端が微妙に見えてしまう現象への対応
  border-right: 1px solid #ffffff;
  border-bottom: 1px solid #ffffff;

  ${media.mdsp} {
    display: none;
  }
  iframe {
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: calc(100vw * 2 / 3 * 16 / 9);
    height: calc(100vw * 2 / 3);
    ${media.sp} {
      width: calc(100vw - 32px);
      height: calc(100vw - 32px);
    }
  }
`

const BGKeys = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vw;
  top: 0%;
  left: 10%;
  display: grid;
  grid-template-columns: repeat(50, 2%);
  grid-template-rows: repeat(50, 2%);
  --grid-row: 1;
  --grid-column: 1;
  transform: rotate3d(0, 0, 1, -10deg);
  opacity: 1;
  z-index: ${zIndex.base};
  ${media.mdsp} {
    display: none;
  }
`

const BGKey = styled.div<{ src: string; gridRow: number; gridColumn }>`
  opacity: 0;
  grid-area: ${(props) => props.gridRow} / ${(props) => props.gridColumn} / span 12 / span 5;
  will-change: transform;
  width: 160px;
  height: 160px;
  background-image: url(${(props) => props.src});
  background-size: cover;
  ${media.lg} {
    width: 320px;
    height: 320px;
  }
`

const ConceptSection = styled(Section)`
  padding: 128px 0 128px 0;
  overflow: hidden;
  ${media.mdsp} {
    padding: 32px 0px 128px 0px;
  }
`

const Message = styled.h2`
  ${font.inter.h3}
  line-height:240%;
  letter-spacing: 1px;
  text-align: left;
  z-index: ${zIndex.default};
  ${media.mdsp} {
    ${font.inter.subtitle1};
    line-height: 200%;
  }
  ${media.md} {
    ${font.inter.h3};
    line-height: 200%;
  }
`

const ConceptPhotos = styled.div`
  display: grid;
  gap: 32px;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: auto;
  /* width: 100%; */
  overflow: visible;
  padding: 128px 32px 0;
`

const ConceptPhoto = styled.div<{ src: string }>`
  width: 640px;
  height: 480px;
  background-image: url(${(props) => props.src});
  background-size: cover;
  ${media.mdsp} {
    width: 315px;
    height: 420px;
    background-size: cover;
  }
`

const WHYSection = styled(Section)``
const WHYWrap = styled(Wrap)`
  flex-direction: column;
  align-items: center;
`

const WhyKeys = styled.div`
  display: grid;
  grid-template-rows: repeat(2, 1fr);
  grid-template-columns: repeat(2, 1fr);
  gap: 64px;
  ${media.sp} {
    grid-template-rows: repeat(4, 1fr);
    grid-template-columns: repeat(1, 1fr);
  }
`

const WhyKey = styled.div`
  color: ${color.content.dark};
  width: 320px;
  img {
    width: 150px;
    height: auto;
    ${media.mdsp} {
      width: 100px;
      margin: 0 0 16px 0;
    }
  }
  h4 {
    ${font.inter.h3};
    margin: 0 0 16px 0;
    ${media.mdsp} {
      ${font.inter.subtitle1};
    }
  }
  p {
    ${font.inter.article2};
  }
`

const ShopSection = styled(Section)``

const ShopWrap = styled(Wrap)`
  display: grid;
  gap: 64px;
  grid-template-areas:
    'B A'
    'C A';
  grid-template-rows: auto 1fr;
  ${media.mdsp} {
    width: 100%;
    grid-template-areas:
      'B'
      'A'
      'C';
  }
`

const WorkshopSection = styled(Section)``
const WorkshopWrap = styled(Wrap)`
  display: grid;
  gap: 64px;
  grid-template-areas:
    'A B'
    'A C';
  ${media.mdsp} {
    width: 100%;
    grid-template-areas:
      'B'
      'A'
      'C';
  }
`
const WorkShopSectionTitle = styled(SectionTitleGroup)`
  grid-area: B;
  margin: 0;
  ${media.mdsp} {
    margin: 0;
  }
`

const WorkShopSectionContents = styled.div`
  grid-area: C;
`
const WorkShopImgWrap = styled.div`
  grid-area: A;
  ${media.lg} {
    width: 495px;
  }
`
const WorkShopImg = styled.img`
  width: 100%;
`
const WorkshopDesc = styled.p`
  text-align: left;
  ${font.inter.article1};
  color: ${color.content.dark};
  margin: 0 0 32px 0;
`
const Program = styled.div`
  padding: 16px;
  margin: 0 0 32px 0;
  background-color: ${color.background.blue};
  text-align: left;
  border-radius: 8px;
`
const ProgramLabel = styled.p`
  ${font.inter.subtitle2};
  margin: 0 0 8px 0;
  &:before {
    display: inline-block;
    content: '';
    background-image: url('/images/icons/triangle.svg');
    width: 12px;
    height: 12px;
    margin: 0 2px 0 0;
  }
`

const ProgramDesc = styled.p`
  ${font.inter.subtitle2};
`

const WorkshopInfo = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  width: 100%;
`

const Price = styled.p`
  ${font.inter.h3};
  span {
    ${font.inter.label};
  }
`

const MakingSection = styled(Section)``

const MakingWrap = styled(Wrap)`
  justify-content: flex-start;
  flex-direction: column;
`

const MakingScrollWrap = styled.div`
  position: relative;
  width: 100%;
  /* overflow-y: hidden; */
  overflow-x: scroll;
  padding: 0 0 64px 0;
  white-space: nowrap;
  overflow: auto;
  ::-webkit-scrollbar {
    height: 5px;
  }
  ::-webkit-scrollbar-track {
    background: ${color.content.superLight};
    border: none;
    border-radius: 0px;
    height: 5px;
    /* box-shadow: inset 0 0 2px #777;  */
  }
  ::-webkit-scrollbar-thumb {
    background: ${color.content.dark};
    border-radius: 0px;
    box-shadow: none;
  }
`

const MakingItem = styled.div`
  position: relative;
  width: 360px;
  margin: 0 32px 0 0;
  text-align: left;
  display: inline-flex;
  flex-direction: column;
  h3 {
    ${font.inter.h3};
    margin: 0 0 32px 0;
    white-space: normal;
  }
  p {
    ${font.inter.body2};
    white-space: normal;
  }
`
const MakingItemImg = styled.img`
  width: 100%;
  height: auto;
  margin: 0 0 32px 0;
`

const MakingScrollContents = styled.div`
  position: relative;
  display: grid;
  gap: 32px;
  grid-template-columns: repeat(4, auto);
`

const MoldSection = styled(Section)``
const MoldWrap = styled(Wrap)`
  display: grid;
  gap: 64px;
  grid-template-areas:
    'A B'
    'A C';
  ${media.mdsp} {
    width: 100%;
    grid-template-areas:
      'B'
      'A'
      'C';
  }
`

const MoldSliderWrap = styled.div`
  grid-area: A;
  ${media.mdsp} {
    width: 100%;
    overflow: hidden;
  }
`
const MoldTitleWrap = styled(SectionTitleGroup)`
  grid-area: B;
  margin: 0px;
  ${media.mdsp} {
    margin: 0;
  }
`
const MoldContentsWrap = styled.div`
  grid-area: C;
`

const MoldDesc = styled.p`
  text-align: left;
  ${font.inter.article1};
  margin: 0 0 32px 0;
`

const MoldSlider = styled.div`
  position: relative;
  max-width: 495px;
  img {
    object-fit: cover;
  }
`

const SlideImg = styled.img`
  /* min-width:495px; */
  /* height: 360px; */
  width: 100%;
  height: 100%;
`

const Download = styled.a`
  ${font.inter.body1};
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 16px 0 0 0;
  cursor: pointer;
  &:before {
    content: '';
    display: block;
    width: 32px;
    height: 32px;
    margin: 0 16px 0 0;
    background-image: url('/images/icons/openNew.svg');
    background-size: cover;
  }
`

const DownloadButton = styled(Button)`
  margin: 32px 0 0 0;
`

const AboutSection = styled(Section)``

const AboutWrap = styled(Wrap)`
  display: grid;
  gap: 64px;
  grid-template-areas:
    'B A'
    'C A';
  ${media.mdsp} {
    width: 100%;
    grid-template-areas:
      'B'
      'A'
      'C';
  }
`
const AboutTitleWrap = styled(SectionTitleGroup)`
  grid-area: B;
  margin: 0;
  ${media.mdsp} {
    margin: 0;
  }
`
const AboutContentsWrap = styled.div`
  grid-area: C;
  text-align: left;
  p {
    ${font.inter.article1};
    margin: 0 0 32px 0;
  }
  ${media.mdsp} {
    margin: 0;
  }
`
const AboutImageWrap = styled.div`
  position: relative;
  grid-area: A;
  ${media.lg} {
    min-width: 495px;
  }
  ${media.mdsp} {
    width: 100%;
  }
  &:after {
    content: '';
    display: block;
    width: 124px;
    height: 124px;
    position: absolute;
    top: -16px;
    left: -16px;
    background-image: url('/images/lodgeLogo.svg');
    background-size: cover;
    ${zIndex.default};
  }
`

const AboutDivider = styled(Divider)`
  margin: 0 0 32px 0;
`

const LibrarySection = styled(Section)``
const LibraryWrap = styled(Wrap)`
  max-width: 640px;
  flex-direction: column;
  align-items: center;
  text-align: left;
`

const Filters = styled.ul`
  display: flex;
  flex-direction: columns;
  padding: 0 0 32px 0;
  ${media.mdsp} {
    width: 100%;
    overflow: auto;
    flex-wrap: wrap;
  }
`

const Filter = styled.li<{ isSelected: boolean }>`
  display: flex;
  background-color: ${(props) => (props.isSelected ? color.primary : color.background.white)};
  color: ${(props) => (props.isSelected ? color.content.white : color.background.dark)};
  padding: 8px;
  margin: 0 16px 16px 0;
  border-radius: 4px;
  border: 2px solid ${color.primary};
  ${font.courier.subtitle2};
  cursor: pointer;
`
const Palette = styled.span<{ color: string; isSelected: boolean }>`
  position: relative;
  display: inline-block;
  width: 16px;
  height: 16px;
  margin: 0 12px 0 0;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  border: ${(props) => (props.isSelected ? 1 : 0)}px solid ${color.background.white};
  &:after {
    content: '';
    display: ${(props) => (props.isSelected ? 'none' : 'block')};
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 1px solid ${(props) => props.color};
  }
`
const LibraryDesc = styled.p`
  ${font.inter.article1};
  padding: 0 0 32px 0;
`

const MaterialGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  width: 100%;
  margin: 0 0 32px 0;
  ${media.sp} {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
`
