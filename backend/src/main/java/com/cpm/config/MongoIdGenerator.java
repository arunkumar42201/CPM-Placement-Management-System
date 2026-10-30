package com.cpm.config;

import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.mapping.MongoId;
import org.springframework.data.mongodb.core.mapping.event.BeforeConvertCallback;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.stereotype.Component;
import org.springframework.util.ReflectionUtils;

import java.lang.reflect.Field;

@Component
public class MongoIdGenerator implements BeforeConvertCallback<Object> {

    private final ObjectProvider<MongoTemplate> mongoTemplateProvider;

    public MongoIdGenerator(ObjectProvider<MongoTemplate> mongoTemplateProvider) {
        this.mongoTemplateProvider = mongoTemplateProvider;
    }

    @Override
    @SuppressWarnings("null")
    public Object onBeforeConvert(Object source, String collectionName) {
        Field idField = null;
        for (Field field : source.getClass().getDeclaredFields()) {
            if (field.isAnnotationPresent(MongoId.class)) {
                idField = field;
                break;
            }
        }
        if (idField == null) {
            return source;
        }

        ReflectionUtils.makeAccessible(idField);
        if (ReflectionUtils.getField(idField, source) != null) {
            return source;
        }

        Query query = Query.query(Criteria.where("_id").is(collectionName));
        Update update = new Update().inc("sequence", 1L);
        FindAndModifyOptions options = FindAndModifyOptions.options().returnNew(true).upsert(true);
        MongoCounter counter = mongoTemplateProvider.getObject().findAndModify(query, update, options, MongoCounter.class);
        if (counter == null || counter.getSequence() == null) {
            throw new IllegalStateException("Could not allocate a MongoDB ID for collection " + collectionName);
        }
        ReflectionUtils.setField(idField, source, counter.getSequence());
        return source;
    }
}
