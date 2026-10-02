import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { buttonVariants } from '@ying/shared-react/ui'

import ProgrammingSVG from '@/svgs/programming.svg?react'
import FolderSVG from '@/svgs/folder.svg?react'
import ClientSVG from '@/svgs/client.svg?react'
import ReactSVG from '@/svgs/react.svg?react'
import ServerSVG from '@/svgs/server.svg?react'
import FloatingSVG from '@/svgs/floating.svg?react'
import { CopyText } from '@/components/copy-text'
import { MaxWidthWrapper } from '@/layouts/max-width-wrapper'

export const Route = createFileRoute('/$lang/')({ component: LandingPage })

const Items = [
  {
    title: 'projectManager',
    desc: 'projectManagerDesc',
    svg: <FolderSVG className="text-primary w-full h-40" />
  },
  {
    title: 'client',
    desc: 'clientDesc',
    svg: <ClientSVG className="text-primary w-full h-40" />
  },
  {
    title: 'managementEnd',
    desc: 'managementEndDesc',
    svg: <ReactSVG className="text-primary w-full h-40" />
  },
  {
    title: 'server',
    desc: 'serverEnd',
    svg: <ServerSVG className="text-primary w-full h-40" />
  }
]

function LandingPage() {
  const { t } = useTranslation('landing_page')

  return (
    <MaxWidthWrapper>
      <section className="grid grid-cols-1 md:grid-cols-[58%_40%] gap-[2%] my-4">
        <div className="text-center md:text-left self-center">
          <h1 className="text-5xl">
            {t('welcomeToUse')} <span className="text-primary">YingStarter</span>
          </h1>
          <p className="my-4">{t('desc')}</p>
          <a className={buttonVariants()} href="https://github.com/JackDeng666/ying-starter" target="_blank">
            {t('github')}
          </a>
        </div>
        <ProgrammingSVG className="text-primary w-full h-auto self-center" />
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
        {Items.map((el, index) => (
          <div
            key={index}
            className="bg-background p-4 rounded-md shadow-xs hover:shadow-sm flex flex-col items-center gap-4"
          >
            <div className="text-xl">{t(el.title)}</div>
            <div>{t(el.desc)}</div>
            {el.svg}
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-[60%_40%] my-4">
        <div className="flex flex-col gap-3 mb-4">
          <h1 className="text-4xl text-center md:text-left">{t('quickStart')}</h1>
          <p>{t('mode1')}</p>
          <p>
            {t('goDirectlyTo')}【
            <a href="https://github.com/JackDeng666/ying-starter" target="_blank" className="text-primary">
              ying-starter
            </a>
            】{t('downloadTheProjectLocally')}
          </p>
          <p>{t('mode2')}</p>
          <p>
            {t('installTheDownloadTools')}【
            <a href="https://github.com/JackDeng666/ying-tools" target="_blank" className="text-primary">
              ying-tools
            </a>
            】
          </p>
          <CopyText value="npm i ying-tools -g" />
          <p>{t('toolsDesc1')}</p>
          <CopyText value={`ying crt [${t('projectName')}]`} />
          <p>{t('toolsDesc2')}</p>
          <p>{t('toolsDesc3')}</p>
          <p>{t('toolsDesc4')}</p>
        </div>

        <FloatingSVG className="text-primary w-full h-auto self-center" />
      </section>
    </MaxWidthWrapper>
  )
}
