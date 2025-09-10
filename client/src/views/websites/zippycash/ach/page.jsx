import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import AchTable from 'src/components/websites/zippycash/ach/page';

const BCrumb = [
  { to: '/', title: 'Home' },
  { to: '/zippycash/ach', title: 'ACH' },
];

function page() {
  return (
    <>
      <PageContainer title="Zippy Cash - ACH" description="ACH Lead Management">
        <Breadcrumb title="ACH Leads" items={BCrumb} />
        <AchTable />
      </PageContainer>
    </>
  );
}

export default page;

