﻿using System;
using System.Linq;
using System.Threading.Tasks;
using Forum.Data.Common.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Forum.Data.Common
{
    public class Repository<T> : IRepository<T>, IDisposable where T : class
    {
        private readonly ForumContext context;
        private readonly DbSet<T> set;

        public Repository(ForumContext context)
        {
            this.context = context;
            this.set = context.Set<T>();
        }

        public IQueryable<T> Query()
        {
            return this.set;
        }

        public T Find(object id)
        {
            return this.set.Find(id);
        }

        public void Add(T entity)
        {
             this.set.Add(entity);
        }

        public void Update(T entity)
        {
            this.set.Update(entity);
        }

        public void Delete(T entity)
        {
            this.set.Remove(entity);
        }

        public Task<int> SaveChangesAsync()
        {
            return this.context.SaveChangesAsync();
        }

        public void Dispose()
        {
            this.context.Dispose();
        }
    }
}
