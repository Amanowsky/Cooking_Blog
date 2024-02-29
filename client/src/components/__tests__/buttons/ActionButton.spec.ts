import {expect, describe, it} from 'vitest';
import {VueWrapper, mount} from '@vue/test-utils';
import ActionButton from '@/components/buttons/ActionButton.vue';

describe('ActionButton.vue', () => {
  let wrapper: VueWrapper;
  const createComponent = (config = {}) => {wrapper = mount(ActionButton,config)};
  const findButton = () => wrapper.find('[data-test="ActionButtonMainBtn"]');

  describe('Props', () => {
    it('should set classes based on prop.isColored', async () => {
      createComponent({
        props: {
          isColored: true
        }
      });

      expect(findButton().classes()).toContain('bg-blue');
      await wrapper.setProps({isColored: false});
      expect(findButton().classes()).toContain('bg-black');
      expect(findButton().classes()).not.toContain('bg-blue');
      await wrapper.setProps({isColored: true, isWhite: true});
      expect(findButton().classes()).toContain('bg-black');
      expect(findButton().classes()).not.toContain('bg-blue');
    });

    it('should set classes based on prop.isWhite', async () => {
      createComponent({
        props: {
          isWhite: true
        }
      });

      expect(findButton().classes()).toContain('bg-white');
      expect(findButton().classes()).toContain('text-black');
      expect(findButton().classes()).not.toContain('text-white');
      await wrapper.setProps({isWhite: false});
      expect(findButton().classes()).toContain('bg-black');
      expect(findButton().classes()).not.toContain('bg-white');
      expect(findButton().classes()).toContain('text-white');
    });

    it('should set classes based on prop.biggerBorderRadius', async () => {
      createComponent({
        props: {
          biggerBorderRadius: true
        }
      });

      expect(findButton().classes()).toContain('rounded-[8px]');
      await wrapper.setProps({biggerBorderRadius: false});
      expect(findButton().classes()).toContain('rounded-[6px]');
      expect(findButton().classes()).toContain('md:rounded-[8px]');
    });

    it('should set classes based on prop.isWider', async () => {
      createComponent({
        props: {
          isWider: true
        }
      });

      expect(findButton().classes()).toContain('md:w-[160px]');
      expect(findButton().classes()).toContain('w-[100px]');
      await wrapper.setProps({isWider: false});
      expect(findButton().classes()).toContain('w-auto');
    });
  });

  describe('Emits', () => {
    it('should emit clickAction if button is clicked', async () => {
      createComponent();

      await findButton().trigger('click');
      expect(wrapper.emitted().clickAction).toBeDefined();
    });
  });

  describe('Slots', () => {
    it('should render contents in default slot', () => {
      createComponent({
        slots : {
          default: 'testContent'
        }
      });

      expect(findButton().text()).toContain('testContent');
    });
  });
});
