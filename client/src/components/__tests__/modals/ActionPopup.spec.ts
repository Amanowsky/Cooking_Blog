import {expect, describe, it, vi} from 'vitest';
import {VueWrapper, mount} from '@vue/test-utils';
import ActionPopup from '@/components/modals/ActionPopup.vue';
import ActionButton from '@/components/buttons/ActionButton.vue';

describe('ActionPopup.vue', () => {
  let wrapper: VueWrapper;
  const createComponent = (config = {}) => {wrapper = mount(ActionPopup,config)};
  const findDialog = () => wrapper.find('[data-test="ActionPopupDialog"]');
  const findActionButton = () => wrapper.findAllComponents(ActionButton);

  describe('Props', () => {
    it('should set id based on prop.popupId', () => {
      createComponent({
        props: {
          popupId: 'testId',
          buttonFunction: () => {}
        }
      });

      expect(findDialog().attributes()['id']).toBe('testId');
    });

    it('should render text in ActionButton based on prop.actionButtonText', () => {
      createComponent({
        props: {
          popuoId: 'testId',
          buttonFunction: () => {},
          actionButtonText: 'testText'
        }
      });

      expect(findActionButton()[0].text()).toContain('testText');
    });

    it('should execute prop.buttonFunction if ActionButton is clicked', async () => {
      const testObj = {
        testFn: () => 'testReturn'
      };
      const mockTestFn = vi.spyOn(testObj, 'testFn');
      createComponent({
        props: {
          popuoId: 'testId',
          buttonFunction: mockTestFn
        }
      });

      expect(mockTestFn).not.toHaveBeenCalled();
      await findActionButton()[0].trigger('click');
      expect(mockTestFn).toHaveBeenCalled();
    });
  });
});
