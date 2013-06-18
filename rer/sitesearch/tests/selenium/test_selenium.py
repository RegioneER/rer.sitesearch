from selenium.common.exceptions import NoSuchElementException
from rer.sitesearch.testing import SELENIUM_SITESEARCH_TESTING
from plone.app.search.tests.base import SearchSeleniumTestCase
from plone.app.testing.selenium_layers import open
import time
from rer.sitesearch.tests.base import BaseTestCase


class SimpleScenarioTestCase(BaseTestCase):

    layer = SELENIUM_SITESEARCH_TESTING

    def setUp(self):
        """
        """
        self.portal = self.layer['portal']
        self.request = self.layer['request']
        self.markRequestWithLayer()

    def test_basic_search(self):
        """
        Check if all items are displayed correctly in a simple empty search
        """
        portal = self.layer['portal']
        sel = self.layer['selenium']

        # Open search form
        open(sel, portal.absolute_url() + '/@@search')

        # Is 'relevance' the current/default sorting option and thus
        # is not clickable?
        sorter = sel.find_element_by_id('sorting-options')
        self.assertEquals(sorter.find_elements_by_link_text('relevance'), [])

        # By default there are no search results because there is no
        # SearchableText specified in request when accessing the form directly:
        res_num = sel.find_element_by_id('search-results-number')
        self.assertEquals(res_num.text, '90 on 90')

        #Now we check if all tags are displayed and which is selected tab
        tabs = sel.find_elements_by_class_name('tabElement')
        self.assertEquals(len(tabs), 3)
        selected_tab = sel.find_element_by_class_name('active').find_element_by_css_selector('a')
        self.assertEquals(selected_tab.text, "All")

        #Check if there are some filters
        filters = sel.find_element_by_id('indexes-options').find_elements_by_class_name('field')
        self.assertEquals(len(filters), 1)
        subject_div = sel.find_element_by_id('indexes-options').find_element_by_class_name('field')
        self.assertEquals(subject_div.find_element_by_tag_name('h3').text, "Subject")
        subjects = [x.get_attribute('value') for x in subject_div.find_elements_by_tag_name('input')]
        self.assertEquals(subjects, ['apple', 'kiwi', 'mango'])

        #Now we try to filter search results clicking on a tab.
        documents = sel.find_element_by_class_name('documents')
        documents.click()
        # We should give the view some time in order to finish the animation of
        # the search results
        time.sleep(1)
        res_num = sel.find_element_by_id('search-results-number')
        self.assertEquals(res_num.text, '85 on 90')

        #checking which is selected tab
        selected_tab = sel.find_element_by_class_name('active').find_element_by_css_selector('a')
        self.assertEquals(selected_tab.text, "Documents")

        #Now we check if all tags are displayed and which is selected tab
        subject_div = sel.find_element_by_id('indexes-options').find_element_by_class_name('field')
        self.assertEquals(subject_div.find_element_by_tag_name('h3').text, "Subject")
        subjects = subject_div.find_elements_by_tag_name('input')
        self.assertEquals(len(subjects), 2)

        #now we try to filter also by subject
        subj_apple = subject_div.find_element_by_id("Subject_1")
        self.assertEquals(subj_apple.get_attribute('value'), 'apple')
        subj_apple.click()
        # We should give the view some time in order to finish the animation of
        # the search results
        time.sleep(1)
        res_num = sel.find_element_by_id('search-results-number')
        self.assertEquals(res_num.text, '5 on 10')

        #we check if "apple" is selected
        subject_div = sel.find_element_by_id('indexes-options').find_element_by_class_name('field')
        subj_apple = subject_div.find_element_by_id("Subject_1")
        self.assertEquals(subj_apple.is_selected(), True)

        #now we try to remove all the filters for Subjects
        remove_link = subject_div.find_element_by_id("deselect-Subject")
        remove_link.click()
        # We should give the view some time in order to finish the animation of
        # the search results
        time.sleep(1)
        res_num = sel.find_element_by_id('search-results-number')
        self.assertEquals(res_num.text, '85 on 90')
        #we check if "apple" isn't selected
        subject_div = sel.find_element_by_id('indexes-options').find_element_by_class_name('field')
        subj_apple = subject_div.find_element_by_id("Subject_1")
        self.assertEquals(subj_apple.is_selected(), False)
