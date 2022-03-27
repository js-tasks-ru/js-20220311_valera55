
export default class ColumnChart {
  subElems = {};
  chartHeight = 50;

  constructor({
    data = [],
    label = '',
    value = 0,
    link = '',
    formatHeading = function(arg){return arg;},//для форматирования значения в зависимости от типа данных
  } = {}) {
    this.data = data;
    this.label = label;
    this.value = formatHeading(value);
    this.link = link;

    this.render();
  }

  template(){
    return `<div class="column-chart column-chart_loading" style="--chart-height: ${this.chartHeight}">
                <div class="column-chart__title">
                  Total ${this.label}
                  ${this.getLink()}
                </div>
                <div class="column-chart__container">
                  <div data-element="header" class="column-chart__header">
                    ${this.value}
                  </div>
                  <div data-element="body" class="column-chart__chart">
                    ${this.getColumnBody()}
                  </div>
                </div>
            </div>
    `;
  }

  render(){
    const elem = document.createElement('div'); // для того, чтобы было куда вставить template с помощью innerHtml
    elem.innerHTML = this.template();
    this.element = elem.firstElementChild; // удаляем обёртку div, созданную выше
    if (this.data.length){
      this.element.classList.remove('column-chart_loading'); //удаляем скелетон если есть данные с сервера
      this.subElems = this.getSubElems();
    }
  }

  getSubElems() { //для получения элементов, в которых будут обновляться данные, чтобы при каждой перерисовке не искать их в ДОМе
    const result = {};
    const elems = this.element.querySelectorAll('[data-element]');

    for (const subElem of elems){
      const name = subElem.dataset.element;
      result[name] = subElem;
    }
    return result;
  }

  getColumnBody() {
    const maxValue = Math.max(...this.data);
    const scale = this.chartHeight/maxValue;

    return this.data.map(function (item){
      const percent = ((item/maxValue)*100).toFixed(0);

      return `<div style="--value: ${Math.floor(item*scale)}" data-tooltip="${percent}%"></div>`;
    }).join('');
  }

  getLink(){
    return this.link ? `<a class="column-chart__link" href="${this.link}">View all</a>`: '';
  }

  update(data) {
    this.data = data;
    this.subElems.body.innerHTML = this.getColumnBody(data);
  }

  remove(){
    if (this.element){
      this.element.remove();
    }
  }

  destroy(){
    this.remove();
    this.element = null;
    this.subElems = {};
  }
}
