using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace sniper.Common.Mapping
{
    public static class Update
    {
        public static void Model<T>(T source, T destination)
            where T : class
        {
            if (null == destination) return;

            var t = typeof(T);
            var props = t.GetProperties().Where(prop => !Attribute.IsDefined(prop, typeof(NotMappedAttribute)));

            foreach (var propertyInfo in props)
            {
                if (propertyInfo.Name == "DateCreated")
                    continue;

                if (propertyInfo.Name == "DateModified")
                {
                    propertyInfo.SetValue(destination, DateTime.Now);
                    continue;
                }

                var val = propertyInfo.GetValue(source);
                propertyInfo.SetValue(destination, val);
            }
        }

        public static void ModelFromVM<TS, TD>(TS source, TD destination)
            where TS : class
            where TD : class
        {
            if (null == destination) return;

            var td = typeof(TD);
            var ts = typeof(TS);
            var destinationProps = td.GetProperties().Where(prop => !Attribute.IsDefined(prop, typeof(NotMappedAttribute)));
            var sourceProps = ts.GetProperties().Where(prop => !Attribute.IsDefined(prop, typeof(NotMappedAttribute))).ToList();

            foreach (var propertyInfo in destinationProps)
            {
                if (propertyInfo.Name == "DateCreated")
                    continue;

                if (propertyInfo.Name == "DateModified")
                {
                    propertyInfo.SetValue(destination, DateTime.Now);
                    continue;
                }

                var sourceProp = sourceProps.FirstOrDefault(p => p.Name == propertyInfo.Name);
                if (sourceProp == null)
                    continue;

                if (propertyInfo.PropertyType != sourceProp.PropertyType)
                {
                    if (propertyInfo.PropertyType == typeof(DateTime) && sourceProp.PropertyType == typeof(string))
                    {
                        var v = (string)sourceProp.GetValue(source);
                        if (v != null)
                        {
                            propertyInfo.SetValue(destination, DateTime.Parse(v));
                            continue;
                        }
                    }
                }

                var val = sourceProp.GetValue(source);
                propertyInfo.SetValue(destination, val);
            }
        }
    }
}