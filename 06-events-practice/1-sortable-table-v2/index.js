export default class SortableTable {
  constructor(headerConfig, {
    data = [],
    sorted = {}
  } = {}) {



  }

  onSortClick = event => {
    const column = event.target.closest('[data-sortable="true"]');

    const toggleOrder = order => {
      const orders = {
        asc: 'desc',
        desc: 'asc'
      }
      return orders[order];
    };

    if(column){
      const {id, order} = column.dataset;
      const newOrder = toggleOrder(order);
      const sortedData = this.sortData(id, newOrder);
      const arrow = column.querySelector('.sortable-table__sort-arrow');

      column.dataset.order = newOrder;

      if(!arrow){
        column.append(this.subElements.arrow);
      }

      this.subElements.body.innerHTML = this.getTableRows(sortedData);
    }
  }

  sortData(id, order){
    const arr = [...this.data];
    const column = this.headerConfig.find(item => item.id === id);
    const {sortType, customSorting} = column;
    const direction = order === 'asc' ? 1 : -1;

    return arr.sort((a, b) => {
      switch (sortType){
      case 'number':
        return direction * (a[id] - b[id]);
      case 'string':
        return direction * a[id].localeCompare(b[id], ['ru', 'en']);
      default:
        return direction * (a[id] - b[id]);
      }
    });
  }

  getTableHeader(){
    return `<div data-element="header" class="sortable-table__header sortable-table__row">
              ${this.headerConfig.map(item => {this.getHeaderRow(item).join('')})}
           </div>`;
  }

  getHeaderRow({id, title, sortable}){
    const order = this.sorted.id === id ? this.sorted.order : 'asc';

    return `
    <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}" data-order="${order}">
        <span>${title}</span>
        ${this.getHeaderSortingArrow(id)}
    </div>`;
  }

  getHeaderSortingArrow(id){ //рисует стрелку сортировки
    const isOrderExist = this.sorted.id === id ? this.sorted.order : '';

    return isOrderExist
            ? `<span data-element="arrow" class="sortable-table__sort-arrow">
                    <span class="sort-arrow"></span>
                </span>`: '';
  }

  getTableBody(){
    return `
    <div data-element="body" class="sortable-table__body">
        ${this.getTableRows(this.data)}
    </div>`;
  }

  getTableRows(data = []){
    return data.map(item => {
      return `
      <a href="/products/${item.id}" class="sortable-table__row">
        ${this.getTableRow(item)}
      </a>`;
    }).join('');
  }

  getTableRow(item){
    const cells = this.headerConfig.map(({id, template}) => {
      return {
        id, template
      };
    });

    return cells.map(({id, template}) => {
      return template
          ? template(item[id]) : `<div class="sortable-table__cell">${item[id]}`;
    }).join('');
  }

  getTable(data) {
    return `
    <div class="sortable-table">
        ${this.getTableHeader()}
        ${this.getTableBody(data)}
    </div>`;
  }

  render(){
    const {id, order} = this.sorted;
    const wrapper = document.createElement('div');
    const sortedData = this.sortData(id, order);

    wrapper.innerHTML = this.getTable(sortedData);

    const element = wrapper.firstElementChild; //удаляем обёртку from element

    this.element = element;
    this.subElements = this.getSubElems(element);
    this.initEventListeners();
  }
  initEventListeners(){
    this.subElements.header.addEventListener('pointerdown', this.onSortClick);
  }
  getSubElems(element) { //для получения элементов, в которых будут обновляться данные, чтобы при каждой перерисовке не искать их в ДОМе
    const result = {};
    const elems = element.querySelectorAll('[data-element]');

    for (const subElem of elems){
      const name = subElem.dataset.element;
      result[name] = subElem;
    }
    return result;
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }
}
