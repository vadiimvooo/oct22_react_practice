import React, { useState } from 'react';
import './App.scss';
import cn from 'classnames';
import { User } from './types/User';
import { Category } from './types/Category';

import usersFromServer from './api/users';
import productsFromServer from './api/products';
import categoriesFromServer from './api/categories';
import { Good } from './types/Good';
import { Table } from './components';

function getUserById(userId: number | undefined): User | null {
  return usersFromServer.find(user => user.id === userId) || null;
}

function getCategoryById(categoryId: number): Category | null {
  return categoriesFromServer
    .find(category => category.id === categoryId) || null;
}

const goods: Good[] = productsFromServer
  .map(product => ({
    ...product,
    category: getCategoryById(product.categoryId),
    user: getUserById(getCategoryById(product.categoryId)?.ownerId),
  }));

export const App: React.FC = () => {
  const [filterByOwner, setFilterByOwner] = useState('all');
  const [query, setQuery] = useState('');

  let visibleGoods = goods.filter(good => {
    if (filterByOwner === 'all') {
      return good;
    }

    return good.user?.name === filterByOwner;
  });

  if (query) {
    visibleGoods = visibleGoods.filter(good => (
      good.name
        .toLowerCase()
        .includes(query.toLowerCase())
    ));
  }

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                onClick={() => setFilterByOwner('all')}
                className={cn({
                  'is-active': filterByOwner === 'all',
                })}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  data-cy="FilterAllUsers"
                  href="#/"
                  key={user.id}
                  onClick={() => setFilterByOwner(user.name)}
                  className={cn({
                    'is-active': filterByOwner === user.name,
                  })}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {query && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setQuery('')}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 1
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1"
                href="#/"
              >
                Category 2
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 3
              </a>
              <a
                data-cy="Category"
                className="button mr-2 my-1"
                href="#/"
              >
                Category 4
              </a>
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"

              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {goods.length === 0
            ? (
              <p data-cy="NoMatchingMessage">
                No products matching selected criteria
              </p>
            )
            : (<Table goods={visibleGoods} />)}
        </div>
      </div>
    </div>
  );
};
