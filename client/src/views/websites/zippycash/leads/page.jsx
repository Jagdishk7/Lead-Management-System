import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import ZippyLeadsTable from 'src/components/websites/zippycash/leads/page';

const BCrumb = [
    {
        to: "/",
        title: "Home",
    },
    {
        to: "/zippycash/leads",
        title: "Zippy Cash - Primary Leads",
    },
   
];
function page() {
    return (
      <>
        <PageContainer
          title="Zippy Cash - Primary Leads"
          description="this is Lead Management page"
        >
          <Breadcrumb title="Primary Leads" items={BCrumb} />
          <ZippyLeadsTable />
        </PageContainer>
      </>
    );
}

export default page;
