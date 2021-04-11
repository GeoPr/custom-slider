(() => {
  const sliderEls = document.querySelectorAll('.slider');

  const renderHTML = ({ sliderEl, MIN }) => {
    sliderEl.insertAdjacentHTML(
      `beforeend`,
      `
        <div class="slider__value">${MIN}</div>
        <div class="slider__body">
          <div class="slider__thumb" data-type="slider-thumb"></div>
          <div class="slider__line"></div>
        </div>
      `,
    );
  };

  const enableGrabbing = ({ target }, data) => {
    const { type } = target.dataset;
    const { sliderThumbEl, sliderLineEl } = data;
    data.isGrabbed = type === 'slider-thumb';

    sliderThumbEl.style.pointerEvents = data.isGrabbed ? 'none' : 'all';
    sliderThumbEl.style.userSelect = data.isGrabbed ? 'none' : 'all';
    sliderLineEl.style.cursor = data.isGrabbed ? 'grab' : 'auto';
  };

  const disableGrabbing = (e, data) => {
    const { sliderThumbEl, sliderLineEl } = data;
    data.isGrabbed = false;
    sliderThumbEl.style.pointerEvents = 'all';
    sliderThumbEl.style.userSelect = 'all';
    sliderLineEl.style.cursor = 'auto';
  };

  const onMouseMove = ({ offsetX }, data) => {
    const {
      isGrabbed, MIN, MAX_DIFF,
      sliderLineElWidth, sliderThumbElWidth,
      sliderThumbEl, sliderValueEl,
    } = data;

    if (!isGrabbed) return false;

    const offsetPercent = offsetX / sliderLineElWidth * 100;
    const value = Math.round(offsetPercent / 100 * MAX_DIFF);

    sliderThumbEl.style.left = `calc(${value / MAX_DIFF * 100}% - ${sliderThumbElWidth / 2}px)`;
    sliderValueEl.textContent = value + +MIN;
  };

  sliderEls.forEach(sliderEl => {
    const { min: MIN, max: MAX } = sliderEl.dataset;
    const MAX_DIFF = MAX - MIN;

    renderHTML({ sliderEl, MIN });

    let isGrabbed = false;

    const sliderValueEl = sliderEl.querySelector('.slider__value');
    const sliderBodyEl = sliderEl.querySelector('.slider__body');
    const sliderLineEl = sliderEl.querySelector('.slider__line');
    const sliderThumbEl = sliderEl.querySelector('.slider__thumb');

    const sliderThumbElWidth = sliderThumbEl.scrollWidth;
    const sliderLineElWidth = sliderLineEl.scrollWidth;

    const els = {
      sliderValueEl,
      sliderLineEl,
      sliderThumbEl,
    };

    const sizes = {
      sliderThumbElWidth,
      sliderLineElWidth,
    };

    const values = {
      isGrabbed,
      MIN, MAX,
      MAX_DIFF,
    };

    const data = {
      ...els,
      ...sizes,
      ...values,
    };

    sliderBodyEl.addEventListener('mousedown', e => enableGrabbing(e, data));
    sliderBodyEl.addEventListener('mouseup', e => disableGrabbing(e, data));
    sliderBodyEl.addEventListener('mouseleave', e => disableGrabbing(e, data));
    sliderBodyEl.addEventListener('mousemove', e => onMouseMove(e, data));
  });
})();

