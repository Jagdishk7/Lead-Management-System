import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import ZippyLeadsTable from 'src/components/websites/zippycash/leads/page';

const BCrumb = [
  { to: '/', title: 'Home' },
  { to: '/zippycash/leads', title: 'Zippy Cash - Primary Leads' },
];

function Page() {
  return (
    <PageContainer title="Zippy Cash - Primary Leads" description="Primary leads for Zippy Cash">
      <Breadcrumb title="Primary Leads" items={BCrumb} />
      <ZippyLeadsTable />
    </PageContainer>
  );
}

export default Page;
