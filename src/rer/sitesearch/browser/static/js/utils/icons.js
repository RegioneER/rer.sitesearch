import {
  faArchive,
  faBroadcastTower,
  faCalendarAlt,
  faChevronRight,
  faCircleNotch,
  faFile,
  faFolder,
  faFolderOpen,
  faList,
  faListUl,
  faNewspaper,
  faSearch,
  faTag,
  faTags,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';

const icons = {
  faArchive,
  faBroadcastTower,
  faCalendarAlt,
  faChevronRight,
  faCircleNotch,
  faFile,
  faFolder,
  faFolderOpen,
  faList,
  faListUl,
  faNewspaper,
  faSearch,
  faTag,
  faTags,
  faTimes,
};

// this is used for utils.py GROUP_ICONS dict
const getIcon = name => {
  if (name in icons) {
    return icons[name];
  } else {
    return null;
  }
};

export { icons, getIcon };
