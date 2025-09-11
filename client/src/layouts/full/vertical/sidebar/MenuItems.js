import {
  IconAward,
  IconBoxMultiple,
  IconPoint,
  IconBan,
  IconStar,
  IconMoodSmile,
  IconAperture,
  IconChecklist,
  IconUsers,
  IconCalendarEvent,
  IconBrandZwift,
  IconMagnet,
  IconBuildingBank,
  IconShieldCheck,
  IconWorldWww
} from '@tabler/icons-react';

import { uniqueId } from 'lodash';

const Menuitems = [
  // {
  //   navlabel: true,
  //   subheader: 'Agent',
  // },
  // {
  //   id: uniqueId(),
  //   title: 'My Work',
  //   icon: IconChecklist,
  //   href: '/menulevel/',
  //   children: [
  //     {
  //       id: uniqueId(),
  //       title: 'My Leads',
  //       icon: IconUsers,
  //       href: '/l1',
  //     },
  //     {
  //       id: uniqueId(),
  //       title: 'Follow Ups',
  //       icon: IconCalendarEvent,
  //       href: '/l1',
  //     },
  //   ],
  // },
  {
    navlabel: true,
    subheader: 'Websites',
  },
{
      id: uniqueId(),
      title: 'Zippy Cash',
      icon: IconBrandZwift,
      href: '/menulevel/',
      children: [
        {
          id: uniqueId(),
          title: 'Primary Leads',
          icon: IconMagnet,
          href: '/zippycash/leads',
        },
        {
          id: uniqueId(),
          title: 'ACH Data',
          icon: IconBuildingBank,
          href: '/zippycash/ach',
        },
        // {
        //   id: uniqueId(),
        //   title: 'KYC Verifications',
        //   icon: IconShieldCheck,
        //   href: '/l1',
        // },
        // {
        //   id: uniqueId(),
        //   title: 'Level 1.1',
        //   icon: IconPoint,
        //   href: '/l1.1',
        //   children: [
        //     {
        //       id: uniqueId(),
        //       title: 'Level 2',
        //       icon: IconPoint,
        //       href: '/l2',
        //     },
        //     {
        //       id: uniqueId(),
        //       title: 'Level 2.1',
        //       icon: IconPoint,
        //       href: '/l2.1',
        //       children: [
        //         {
        //           id: uniqueId(),
        //           title: 'Level 3',
        //           icon: IconPoint,
        //           href: '/l3',
        //         },
        //         {
        //           id: uniqueId(),
        //           title: 'Level 3.1',
        //           icon: IconPoint,
        //           href: '/l3.1',
        //         },
        //       ],
        //     },
        //   ],
        // },
      ],
    },

];

export default Menuitems;
