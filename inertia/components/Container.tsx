import React from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb'

export const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="px-3 py-5">
      <div className="max-w-7xl mx-auto">{children}</div>
    </div>
  )
}

export const ContainerWithBreadcumbs = ({
  children,
  toolbarRight,
  toolbarLeft,
  breadcrumbs,
}: {
  children: React.ReactNode
  toolbarRight?: React.ReactNode
  toolbarLeft?: React.ReactNode
  breadcrumbs: { title: string; to: string }[]
}) => {
  return (
    <Container>
      <div className="mb-3 flex justify-between items-center">
        <div className="flex items-center">
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((item, index) => {
                return (
                  <React.Fragment key={item.to}>
                    <BreadcrumbItem>
                      {index !== breadcrumbs.length - 1 ? (
                        <BreadcrumbLink href={item.to}>{item.title}</BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage>{item.title}</BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                    {index !== breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                  </React.Fragment>
                )
              })}
            </BreadcrumbList>
          </Breadcrumb>
          {toolbarLeft}
        </div>
        {toolbarRight}
      </div>
      {children}
    </Container>
  )
}
